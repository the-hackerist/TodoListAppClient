import { Slide, ToastContainer } from "react-toastify";

function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
      transition={Slide}
    />
  );
}

export default ToastProvider;
