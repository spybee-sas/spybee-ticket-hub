
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800";
    case "In Progress":
      return "bg-amber-100 text-amber-800";
    case "Closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "Bug":
      return "bg-red-100 text-red-800";
    case "Complaint":
      return "bg-purple-100 text-purple-800";
    case "Delivery Issue":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
