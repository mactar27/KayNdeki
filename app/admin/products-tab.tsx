"use client"

import { useState, useTransition } from "react"
import { formatFCFA } from "@/lib/menu-data"
import { Plus, Edit, Trash2, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react"
import { createProductAction, updateProductAction, deleteProductAction, toggleProductAvailabilityAction } from "@/app/actions/products"
import { uploadImageAction } from "@/app/actions/upload"
import { randomUUID } from "crypto"

export function ProductsTab({ products }: { products: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState({
    id: "",
    category: "sandwich",
    name: "",
    name_wo: "",
    name_en: "",
    description: "",
    price: "",
    image: "",
    available: true,
  })

  const [uploading, setUploading] = useState(false)

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        id: product.id,
        category: product.category,
        name: product.name,
        name_wo: product.name_wo || "",
        name_en: product.name_en || "",
        description: product.description || "",
        price: product.price.toString(),
        image: product.image,
        available: product.available,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        id: crypto.randomUUID(),
        category: "sandwich",
        name: "",
        name_wo: "",
        name_en: "",
        description: "",
        price: "",
        image: "",
        available: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    const file = e.target.files[0]
    const data = new FormData()
    data.append("file", file)
    
    try {
      const result = await uploadImageAction(data)
      if (result.success && result.url) {
        setFormData({ ...formData, image: result.url })
      } else {
        alert(result.error || "Erreur d'upload")
      }
    } catch (error) {
      console.error(error)
      alert("Erreur d'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseInt(formData.price),
    }

    startTransition(async () => {
      if (editingProduct) {
        await updateProductAction(formData.id, productData)
      } else {
        await createProductAction(productData)
      }
      setIsModalOpen(false)
    })
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      startTransition(async () => {
        await deleteProductAction(id)
      })
    }
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleProductAvailabilityAction(id, !currentStatus)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Gestion des Produits</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1A56DB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 bg-slate-50 flex items-center justify-center p-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full object-contain"
                onError={(e) => (e.currentTarget.src = "/products/ingredients.png")}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm text-slate-600 hover:text-[#1A56DB] transition"
                  title="Modifier"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  disabled={isPending}
                  className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm text-slate-600 hover:text-red-600 transition"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-800">{product.name}</h3>
                  {product.name_wo && <p className="text-xs text-slate-500">{product.name_wo}</p>}
                </div>
                <span className="font-bold text-[#1A56DB]">{formatFCFA(product.price)}</span>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {product.available ? "Disponible" : "Indisponible"}
                </span>
                
                <button
                  onClick={() => handleToggleStatus(product.id, product.available)}
                  disabled={isPending}
                  className={`text-sm flex items-center gap-1 ${
                    product.available ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                  }`}
                >
                  {product.available ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  {product.available ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image du produit</label>
                  <div className="flex items-center gap-4">
                    {formData.image ? (
                      <div className="h-16 w-16 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                        <img src={formData.image} alt="Preview" className="h-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-slate-50 rounded-lg border border-slate-200 border-dashed flex items-center justify-center text-slate-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition">
                      {uploading ? "Upload en cours..." : "Choisir une image"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {/* Fallback direct input */}
                  <div className="mt-2">
                    <input 
                      type="text"
                      placeholder="Ou coller une URL (/products/... ou https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom (Français) *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom (Wolof)</label>
                    <input 
                      type="text" 
                      value={formData.name_wo}
                      onChange={(e) => setFormData({...formData, name_wo: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom (Anglais)</label>
                    <input 
                      type="text" 
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prix (FCFA) *</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-colors bg-white"
                    >
                      <option value="sandwich">Sandwich</option>
                      <option value="drink">Boisson</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-colors resize-none"
                    rows={2}
                  ></textarea>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                    className="h-4 w-4 text-[#1A56DB] rounded border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700">Produit disponible à la vente</span>
                </label>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition"
              >
                Annuler
              </button>
              <button 
                form="productForm"
                type="submit"
                disabled={isPending || uploading}
                className="bg-[#1A56DB] hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50"
              >
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
