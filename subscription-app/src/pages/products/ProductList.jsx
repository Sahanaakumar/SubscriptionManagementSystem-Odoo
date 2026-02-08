import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (row) => {
        if (!window.confirm(`Are you sure you want to delete ${row.name}?`)) return;
        try {
            await api.delete(`/products/${row.id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete product");
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name', render: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
        { header: 'Category', accessor: 'category' },
        { header: 'Price', accessor: 'price', render: (row) => `₹${row.price}` },
        { header: 'Stock', accessor: 'stock', render: (row) => row.type === 'service' ? 'N/A' : (row.stock || '0') },
    ];

    if (loading) return <div>Loading products...</div>;

    const canManageProducts = user?.role === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your product catalog.</p>
                </div>
                {canManageProducts && (
                    <button
                        onClick={() => navigate('/products/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Add Product
                    </button>
                )}
            </div>
            <DataTable
                columns={columns}
                data={products}
                isLoading={loading}
                onEdit={canManageProducts ? (row) => navigate(`/products/${row.id}`) : null}
                onDelete={canManageProducts ? handleDelete : null}
            />
        </div>
    );
};

export default ProductList;
