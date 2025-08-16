'use client';
import React from 'react';

const AdditionalInfoTab = ({ specs }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec, index) => (
          <div key={index} className="flex">
            <span className="w-32 text-gray-600">{spec.label}:</span>
            <span className="font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdditionalInfoTab;