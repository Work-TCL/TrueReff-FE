import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/lib/web-api/auth";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const DeleteAccountCard = () => {
  const translate = useTranslations();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      // API call to delete account
      await deleteAccount();
      setLoading(false);
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
      setShowConfirm(false);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="flex flex-col  w-full lg:min-w-[562px] bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md flex-wrap lg:mt-6 mt-2">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Account_Deletion")}
        </h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {translate("Delete_Account_Desc")}{" "}
      </p>
      <button
        onClick={handleDeleteClick}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-fit"
      >
        {translate("Delete_Account")}
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h4 className="text-lg font-semibold mb-3">
              {translate("Confirm_Deletion")}
            </h4>
            <p className="text-sm text-gray-700 mb-5">
              {translate("Confirm_Deletion_Desc")}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                className="w-24 h-10 rounded-xl border border-gray-300 bg-white text-black"
              >
                {translate("Cancel")}
              </Button>
              <Button
                onClick={confirmDelete}
                className="w-24 h-10 rounded-xl border bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading
                  ? translate("Confirm_Deletion_Btn_Loading")
                  : translate("Confirm_Deletion_Btn")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountCard;
