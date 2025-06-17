import ToastProvider from "./ToastProvider";
import Header from "./Header";

function AppLayout({ children }) {
  return (
    <div className="mb-8 px-32">
      <ToastProvider />
      <Header />
      {children}
    </div>
  );
}

export default AppLayout;
