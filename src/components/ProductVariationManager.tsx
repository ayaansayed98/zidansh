import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Product, ProductVariation, ProductAttribute, generateSKU, getVariationDisplayName } from '../types/product';

interface ProductVariationManagerProps {
  product: Product;
  onUpdateProduct: (product: Product) => void;
}

export const ProductVariationManager: React.FC<ProductVariationManagerProps> = ({
  product,
  onUpdateProduct
}) => {
  const [variations, setVariations] = useState<ProductVariation[]>(product.variations);
  const [attributes, setAttributes] = useState<ProductAttribute[]>(product.attributes);
  const [isAddingVariation, setIsAddingVariation] = useState(false);
  const [editingVariation, setEditingVariation] = useState<string | null>(null);
  const [newVariation, setNewVariation] = useState<Partial<ProductVariation>>({
    sku: '',
    attributes: {},
    price: product.basePrice,
    originalPrice: product.baseOriginalPrice,
    stock: 0,
    lowStockThreshold: 5,
    isActive: true
  });

  useEffect(() => {
    setVariations(product.variations);
    setAttributes(product.attributes);
  }, [product]);

  const handleAddAttribute = () => {
    const newAttr: ProductAttribute = {
      id: `attr_${Date.now()}`,
      name: '',
      values: []
    };
    setAttributes([...attributes, newAttr]);
  };

  const handleUpdateAttribute = (attrId: string, field: 'name' | 'values', value: any) => {
    setAttributes(attributes.map(attr => 
      attr.id === attrId 
        ? { ...attr, [field]: value }
        : attr
    ));
  };

  const handleRemoveAttribute = (attrId: string) => {
    setAttributes(attributes.filter(attr => attr.id !== attrId));
    // Also remove this attribute from all variations
    setVariations(variations.map(variation => {
      const { [attributes.find(a => a.id === attrId)?.name || '']: removed, ...rest } = variation.attributes;
      return { ...variation, attributes: rest };
    }));
  };

  const handleAddVariation = () => {
    if (!newVariation.sku || Object.keys(newVariation.attributes || {}).length === 0) {
      alert('Please fill in SKU and at least one attribute');
      return;
    }

    const variation: ProductVariation = {
      id: `var_${Date.now()}`,
      sku: newVariation.sku || generateSKU(product.id, newVariation.attributes || {}),
      attributes: newVariation.attributes || {},
      price: newVariation.price || product.basePrice,
      originalPrice: newVariation.originalPrice || product.baseOriginalPrice,
      stock: newVariation.stock || 0,
      lowStockThreshold: newVariation.lowStockThreshold || 5,
      isActive: newVariation.isActive !== false,
      image: newVariation.image
    };

    setVariations([...variations, variation]);
    setNewVariation({
      sku: '',
      attributes: {},
      price: product.basePrice,
      originalPrice: product.baseOriginalPrice,
      stock: 0,
      lowStockThreshold: 5,
      isActive: true
    });
    setIsAddingVariation(false);
  };

  const handleUpdateVariation = (varId: string, field: keyof ProductVariation, value: any) => {
    setVariations(variations.map(variation => 
      variation.id === varId 
        ? { ...variation, [field]: value }
        : variation
    ));
  };

  const handleDeleteVariation = (varId: string) => {
    setVariations(variations.filter(v => v.id !== varId));
  };

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      attributes,
      variations,
      updatedAt: new Date()
    };
    onUpdateProduct(updatedProduct);
  };

  const getLowStockVariations = () => {
    return variations.filter(v => 
      v.isActive && v.stock > 0 && v.stock <= v.lowStockThreshold
    );
  };

  const getOutOfStockVariations = () => {
    return variations.filter(v => v.isActive && v.stock === 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Variations</h2>
        <button
          onClick={handleSave}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Stock Alerts */}
      <div className="mb-6 space-y-2">
        {getOutOfStockVariations().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {getOutOfStockVariations().length} variation(s) out of stock
              </span>
            </div>
          </div>
        )}
        {getLowStockVariations().length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {getLowStockVariations().length} variation(s) low in stock
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product Attributes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Attributes</h3>
          <button
            onClick={handleAddAttribute}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Attribute
          </button>
        </div>

        <div className="space-y-3">
          {attributes.map(attr => (
            <div key={attr.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <input
                  type="text"
                  placeholder="Attribute name (e.g., Size, Color)"
                  value={attr.name}
                  onChange={(e) => handleUpdateAttribute(attr.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => handleRemoveAttribute(attr.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Values (comma-separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g., S,M,L,XL or Red,Blue,Green"
                  value={attr.values.join(',')}
                  onChange={(e) => handleUpdateAttribute(attr.id, 'values', e.target.value.split(',').map(v => v.trim()).filter(v => v))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Variations */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Variations ({variations.length})</h3>
          <button
            onClick={() => setIsAddingVariation(true)}
            className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Variation
          </button>
        </div>

        {/* Add New Variation Form */}
        {isAddingVariation && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">New Variation</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={newVariation.sku}
                  onChange={(e) => setNewVariation({ ...newVariation, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Auto-generated or custom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="text"
                  value={newVariation.image || ''}
                  onChange={(e) => setNewVariation({ ...newVariation, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Optional image filename"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={newVariation.price}
                  onChange={(e) => setNewVariation({ ...newVariation, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input
                  type="number"
                  value={newVariation.originalPrice}
                  onChange={(e) => setNewVariation({ ...newVariation, originalPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={newVariation.stock}
                  onChange={(e) => setNewVariation({ ...newVariation, stock: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  value={newVariation.lowStockThreshold}
                  onChange={(e) => setNewVariation({ ...newVariation, lowStockThreshold: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attributes</label>
              {attributes.filter(attr => attr.name).map(attr => (
                <div key={attr.id} className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1">{attr.name}</label>
                  <select
                    value={newVariation.attributes?.[attr.name] || ''}
                    onChange={(e) => setNewVariation({
                      ...newVariation,
                      attributes: { ...newVariation.attributes, [attr.name]: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select {attr.name}</option>
                    {attr.values.map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddVariation}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Variation
              </button>
              <button
                onClick={() => setIsAddingVariation(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Variations */}
        <div className="space-y-3">
          {variations.map(variation => (
            <div key={variation.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{variation.sku}</h4>
                  <p className="text-sm text-gray-600">{getVariationDisplayName(variation.attributes)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingVariation(editingVariation === variation.id ? null : variation.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVariation(variation.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editingVariation === variation.id ? (
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={variation.price}
                    onChange={(e) => handleUpdateVariation(variation.id, 'price', parseFloat(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    value={variation.stock}
                    onChange={(e) => handleUpdateVariation(variation.id, 'stock', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Stock"
                  />
                  <input
                    type="number"
                    value={variation.lowStockThreshold}
                    onChange={(e) => handleUpdateVariation(variation.id, 'lowStockThreshold', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Low Stock"
                  />
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">Price: ₹{variation.price}</span>
                    <span className={`font-medium ${
                      variation.stock === 0 ? 'text-red-600' : 
                      variation.stock <= variation.lowStockThreshold ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      Stock: {variation.stock}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={variation.isActive}
                        onChange={(e) => handleUpdateVariation(variation.id, 'isActive', e.target.checked)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      Active
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
