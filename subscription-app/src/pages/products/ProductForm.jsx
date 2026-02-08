import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import api from '../../api/client';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            type: 'service',
            price: 0,
            cost: 0,
            category: 'Software',
            taxId: 1,
            variants: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const res = await api.get(`/products/${id}`);
                    reset(res.data);
                } catch (err) {
                    toast.error("Failed to load product");
                    navigate('/products');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [isEditMode, id, reset, navigate]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                price: parseFloat(data.price),
                cost: parseFloat(data.cost),
                variants: data.variants.map(v => ({ ...v, extraPrice: parseFloat(v.extraPrice || 0) }))
            };

            if (isEditMode) {
                await api.put(`/products/${id}`, payload);
                toast.success("Product updated successfully");
            } else {
                await api.post('/products', payload);
                toast.success("Product created successfully");
            }
            navigate('/products');
        } catch (err) {
            console.error(err);
            toast.error("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isEditMode ? 'Edit Product' : 'Create Product'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* General Info */}
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">General Information</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Basic details about the product or service.
                            </p>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Product name is required' })}
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-blue-600">{errors.name.message}</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Product Type</label>
                                    <select
                                        {...register('type')}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="service">Service</option>
                                        <option value="consumable">Consumable</option>
                                        <option value="storable">Storable Product</option>
                                    </select>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input
                                        type="text"
                                        {...register('category')}
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                    />
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Pricing</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Set your sales price and cost.
                            </p>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Sales Price</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('price', { valueAsNumber: true })}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('cost', { valueAsNumber: true })}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Variants</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Add product variants like size or color.
                            </p>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2 space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-md">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-700">Attribute</label>
                                        <input
                                            {...register(`variants.${index}.attribute`)}
                                            placeholder="e.g. Size"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-700">Value</label>
                                        <input
                                            {...register(`variants.${index}.value`)}
                                            placeholder="e.g. Large"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-medium text-gray-700">Extra Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`variants.${index}.extraPrice`)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-blue-500 hover:text-blue-700 mb-1"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => append({ attribute: '', value: '', extraPrice: 0 })}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <Plus className="-ml-0.5 mr-2 h-4 w-4" />
                                Add Variant
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
