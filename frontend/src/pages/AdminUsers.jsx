"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAllUsers, updateUserCredits, deleteUser } from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [loading, setLoading] = useState(true);
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditsToAdd, setCreditsToAdd] = useState(0);

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();

      // Check if response.data.users is an array and update state
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users); // Access the 'users' array inside the response
      } else {
        console.error("Expected an array but got:", response.data);
        toast.error("Failed to load users. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = (user) => {
    setSelectedUser(user);
    setCreditsToAdd(0);
    setShowAddCreditsModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSubmitCredits = async () => {
    if (!creditsToAdd || creditsToAdd <= 0) {
      toast.error("Please enter a valid number of credits");
      return;
    }

    try {
      await updateUserCredits(selectedUser._id, Number.parseInt(creditsToAdd));

      // Update user credits in the UI
      const updatedUsers = users.map((user) => {
        if (user._id === selectedUser._id) {
          return {
            ...user,
            credits: user.credits + Number.parseInt(creditsToAdd),
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setShowAddCreditsModal(false);
      toast.success(
        `Added ${creditsToAdd} credits to ${selectedUser.fullName}`
      );
    } catch (error) {
      console.error("Error adding credits:", error);
      toast.error("Failed to add credits. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser._id);

      // Remove user from the UI
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      toast.success(`User ${selectedUser.fullName} has been deleted`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <div>
      <Navbar isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Manage Users
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Credits
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Joined
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {user.fullName?.charAt(0) || "U"}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.role === "Admin"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.role === "Admin" ? "Admin" : "User"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.credits}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleAddCredits(user)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Add Credits
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Credits Modal */}
      {showAddCreditsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Add Credits to User</h3>
            <p className="text-sm text-gray-600 mb-4">
              Adding credits to:{" "}
              <span className="font-medium">{selectedUser.fullName}</span>
            </p>

            <div className="mb-4">
              <label
                htmlFor="credits"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Credits to Add
              </label>
              <input
                type="number"
                id="credits"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(e.target.value)}
                min="1"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddCreditsModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCredits}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Credits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Delete User</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedUser.fullName}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
