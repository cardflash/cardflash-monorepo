import LanguageSelector from "@/components/LanguageSelector";
import FileDropZone from "@/components/ui/FileDropZone";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  listAttachments,
  listCollections,
  listDocuments,
  listFlashcards,
  putAttachment,
  updateCollection,
  updateFlashcard,
  updatePDFDocument,
} from "@/lib/storage";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { AsyncZippable, strFromU8, strToU8, unzip, zip } from "fflate";
import { useState } from "react";
export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const { LL } = useI18nContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
      <h1 className="text-3xl xl:text-5xl font-black mt-4">
        {LL.ROUTES.SETTINGS()}
      </h1>
      <div className="w-full">
        <div className="h-full pl-2 mt-4 flex flex-col items-start gap-y-2">
          <LanguageSelector />
          {loading && <Spinner style={{ width: "5rem", height: "5rem" }} />}
          {!loading && (
            <>
              <Button
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  const zipData: AsyncZippable = {};
                  for (const c of await listCollections()) {
                    zipData[`collections/${c.id}.json`] = strToU8(
                      JSON.stringify(c),
                    );
                  }
                  for (const d of await listDocuments()) {
                    zipData[`documents/${d.id}.json`] = strToU8(
                      JSON.stringify(d),
                    );
                  }
                  for (const f of await listFlashcards()) {
                    zipData[`flashcards/${f.id}.json`] = strToU8(
                      JSON.stringify(f),
                    );
                  }
                  for (const a of await listAttachments()) {
                    zipData[
                      `attachments/${a.key}___${(
                        a.data?.type ?? "data"
                      ).replace("/", ".")}`
                    ] = new Uint8Array(await a.data!.arrayBuffer());
                  }
                  zip(zipData, {}, (err, data) => {
                    const blob = new Blob([data], {
                      type: "application/x-zip",
                    });
                    const blobURL = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    document.body.appendChild(a);
                    a.download = new Date().toISOString() + "_cardflash.zip";
                    a.href = blobURL;
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobURL);
                    setLoading(false);
                    navigate;
                  });
                }}
              >
                {LL.EXPORT_DATA()}
              </Button>
              <FileDropZone
                hintText="Import JSON Data"
                onFilesSelected={async (files) => {
                  if (files.length >= 1) {
                    setLoading(true);
                    const file = files[0];
                    unzip(
                      new Uint8Array(await file.arrayBuffer()),
                      {},
                      async (err, data) => {
                        const keys = Object.keys(data);
                        console.log({ data, keys });
                        for (const path of keys) {
                          const array = data[path];
                          const [folder, filename] = path.split("/");
                          console.log({ filename, path });
                          const [key, extension] = filename.split("___");
                          if (folder === "collections") {
                            await updateCollection(
                              JSON.parse(strFromU8(array)),
                            );
                          } else if (folder === "documents") {
                            await updatePDFDocument(
                              JSON.parse(strFromU8(array)),
                            );
                          } else if (folder === "flashcards") {
                            await updateFlashcard(JSON.parse(strFromU8(array)));
                          } else if (folder === "attachments") {
                            await putAttachment(
                              key,
                              new Blob([array], {
                                type: extension.replace(".", "/"),
                              }),
                            );
                          }
                        }
                        setLoading(false);
                        navigate({ to: "/collections" });
                      },
                    );
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
