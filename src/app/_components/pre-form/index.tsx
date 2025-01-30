import React from "react";
import { SlidingTabBar } from "../tabs/sllidingTabs";
import Image from "next/image";

export default function PreFormPage() {
  return (
    <div>
            <SlidingTabBar />

            <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-pink-500 mb-6">
          truereff
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Business Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="ABC"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Company Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="abc@gmail.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">
                Company Phone Number
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="+91 958 624 7482"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">GST Number</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="24GEIB181151"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Website</label>
              <input
                type="url"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="www.truereff.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Type of Business</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option>24GEIB181151</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Brand Documents</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="GST Certificate"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Upload Documents</label>
              <input
                type="file"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <p className="text-gray-500 text-sm">
                JPG or PNG format; maximum size of 20MB.
              </p>
            </div>

            <button
              type="button"
              className="mt-4 bg-pink-500 text-white font-bold py-2 px-4 rounded"
            >
              Add another document
            </button>

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Save and Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
