"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import DeleteModal from "@/app/_components/DeleteModal";

const UserTable = ({
  users,
  pagination,
  search,
}: {
  users: any[];
  pagination: any;
  search?: string;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSearchChange = () => {
    if (pagination) {
      router.push(
        `/admin/users?page=1&size=${pagination.size}` +
          (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "")
      );
    }
  };

  const makePagination = (): React.ReactElement[] => {
    if (!pagination) return [];

    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    const delta = 2;

    const getHref = (page: number) =>
      `/admin/users?page=${page}&size=${pagination.size}` +
      (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

    // Previous Button
    pages.push(
      <Link
        key="prev"
        className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border 
        ${
          currentPage === 1
            ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed pointer-events-none"
            : "bg-white text-emerald-700 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
        }`}
        href={currentPage === 1 ? "#" : getHref(currentPage - 1)}
      >
        Previous
      </Link>
    );

    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(totalPages, currentPage + delta);

    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-emerald-700 hover:bg-emerald-50"
          href={getHref(1)}
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(<span key="e1" className="px-2 text-gray-400">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border 
          ${
            i === currentPage
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50"
          }`}
          href={getHref(i)}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="e2" className="px-2 text-gray-400">...</span>);
      }
      pages.push(
        <Link
          key={totalPages}
          className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-emerald-700 hover:bg-emerald-50"
          href={getHref(totalPages)}
        >
          {totalPages}
        </Link>
      );
    }

    pages.push(
      <Link
        key="next"
        className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border 
        ${
          currentPage === totalPages
            ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed pointer-events-none"
            : "bg-white text-emerald-700 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
        }`}
        href={currentPage === totalPages ? "#" : getHref(currentPage + 1)}
      >
        Next
      </Link>
    );

    return pages;
  };

  const onDelete = async () => {
    try {
      await handleDeleteUser(deleteId!);
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-8 bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />

      {/* Header Section */}
      <div className="p-5 bg-gradient-to-r from-emerald-50/50 to-white flex flex-wrap items-center justify-between gap-4 border-b border-emerald-50">
        <h2 className="text-xl font-semibold text-emerald-900">User Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchChange()}
            placeholder="Search by username or email..."
            className="w-full sm:w-80 px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
          />
          <button
            onClick={handleSearchChange}
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-emerald-50/30 text-emerald-800">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Username</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-emerald-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-emerald-100 shadow-sm">
                      {user.profilePicture ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile_pictures/${user.profilePicture}`}
                          alt={user.username || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-800">{user.username || "—"}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">ID: {user._id.slice(-6)}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border 
                      ${user.role === 'admin' 
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium text-xs border border-transparent hover:border-emerald-100"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-xs border border-transparent hover:border-indigo-100"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(user._id)}
                        className="px-3 py-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-medium text-xs border border-transparent hover:border-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <span className="text-4xl mb-2">👤</span>
                    <p className="text-gray-500 italic">No users found matching your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      {pagination && (
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white border-t border-emerald-50">
          <div className="text-sm text-emerald-900/60 font-medium">
            Showing page <span className="text-emerald-600 font-bold">{pagination.page}</span> of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">{makePagination()}</div>
        </div>
      )}
    </div>
  );
};

export default UserTable;