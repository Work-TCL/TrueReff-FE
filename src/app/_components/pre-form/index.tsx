import React from "react";
import { SlidingTabBar } from "../tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";

export default function PreFormPage() {
  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 px-4 py-10 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />

      <div className="w-full p-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1">
        <SlidingTabBar />

        <div className="pt-6 w-full h-full overflow-auto">
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


          </form>
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
        </div>
      </div>
    </div>
  );
}
