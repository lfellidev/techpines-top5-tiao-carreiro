import Swal from "sweetalert2";

const getSuccess = (message: string): void => {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: message,
  });
};

export default getSuccess;