"use server"

import { put } from "@vercel/blob"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "Aucun fichier fourni." }
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Sauvegarde locale si Vercel Blob n'est pas configuré
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadDir = join(process.cwd(), "public", "uploads")
      
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (e) {
        // Ignorer l'erreur si le dossier existe déjà
      }
      
      // Nettoyer le nom de fichier
      const safeName = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = join(uploadDir, safeName)
      
      await writeFile(filePath, buffer)
      console.log(`Image sauvegardée localement: ${safeName}`)
      
      return { success: true, url: `/uploads/${safeName}` }
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: "Erreur lors de l'upload de l'image." }
  }
}
