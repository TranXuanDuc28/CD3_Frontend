import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

/**
 * Component hiển thị một variant card
 * Cho phép user xem, edit và delete variant
 */
export default function VariantCard({ variant, onEdit, onDelete, index }) {
    const strategyColors = {
        promotion: "bg-orange-100 text-orange-800 border-orange-300",
        benefit: "bg-green-100 text-green-800 border-green-300",
        urgency: "bg-red-100 text-red-800 border-red-300",
        emotion: "bg-purple-100 text-purple-800 border-purple-300",
    };

    const strategyLabels = {
        promotion: "PROMOTION",
        benefit: "BENEFIT",
        urgency: "URGENCY",
        emotion: "EMOTION",
    };

    return (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700">
                        Variant {index + 1}
                    </span>
                    <span
                        className={`text-xs px-2 py-1 rounded-full font-medium border ${strategyColors[variant.strategy] || strategyColors.promotion
                            }`}
                    >
                        {strategyLabels[variant.strategy] || variant.strategy.toUpperCase()}
                    </span>
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onEdit(variant, index)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit variant"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete variant"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Message Content */}
            <div className="mb-3">
                <p className="text-gray-800 text-sm leading-relaxed">
                    {variant.message}
                </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="capitalize">Tone: {variant.tone}</span>
                {variant.dimensions && (
                    <span className="text-gray-400">{variant.dimensions}</span>
                )}
            </div>
        </div>
    );
}
