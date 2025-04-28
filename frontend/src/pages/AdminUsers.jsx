"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [creditsToAdd, setCreditsToAdd] = useState(0)

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll use dummy data

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const dummyUsers = [
          {
            id: 1,
            fullName: "John Doe",
            username: "johndoe",
            email: "john@example.com",
            credits: 100,
            isAdmin: false,
            createdAt: "2023-01-15T10:30:00Z",
          },
          {
            id: 2,
            fullName: "Jane Smith",
            username: "janesmith",
            email: "jane@example.com",
            credits: 75,
            isAdmin: false,
            createdAt: "2023-02-20T14:45:00Z",
          },
          {
            id: 3,
            fullName: "Admin User",
            username: "admin",
            email: "admin@example.com",
            credits: 500,
            isAdmin: true,
            createdAt: "2022-12-01T09:00:00Z",
          },
          {
            id: 4,
            fullName: "Sarah Johnson",
            username: "sarahj",
            email: "sarah@example.com",
            credits: 150,
            isAdmin: false,
            createdAt: "2023-03-10T11:20:00Z",
          },
          {
            id: 5,
            fullName: "Michael Brown",
            username: "mikebrown",
            email: "mike@example.com",
            credits: 50,
            isAdmin: false,
            createdAt: "2023-04-05T16:15:00Z",
          },
        ]

        setUsers(dummyUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleAddCredits = (user) => {
    setSelectedUser(user)
    setCreditsToAdd(0)
    setShowAddCreditsModal(true)
  }

  const handleSubmitCredits = () => {
    if (!creditsToAdd || creditsToAdd <= 0) {
      toast.error("Please enter a valid number of credits")
      return
    }

    // Update user credits
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          credits: user.credits + Number.parseInt(creditsToAdd),
        }
      }
      return user
    })

    setUsers(updatedUsers)
    setShowAddCreditsModal(false)
    toast.success(`Added ${creditsToAdd} credits to ${selectedUser.fullName}`)
  }

  return (
    <div>
      <Navbar isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Manage Users</h2>
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
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">{user.fullName.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.credits}</td>
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
                            <a href="#" className="text-red-600 hover:text-red-900">
                              Suspend
                            </a>
                          </td>
                        </tr>
                      ))}
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
              Adding credits to: <span className="font-medium">{selectedUser.fullName}</span>
            </p>

            <div className="mb-4">
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
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
    </div>
  )
}

export default AdminUsers
