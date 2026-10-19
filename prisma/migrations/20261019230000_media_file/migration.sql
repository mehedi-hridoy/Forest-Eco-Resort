-- CreateTable
CREATE TABLE "MediaFile" (
    "mediaId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("mediaId")
);

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

