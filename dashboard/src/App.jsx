// import { useState } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import Sidebar from "./components/layout/Sidebar";
// import Header from "./components/layout/Header";
// import AppRoutes from "./routes/AppRoutes";
// import { ThemeProvider } from "./context/ThemeContext";


// export default function App() {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <ThemeProvider>
//       <Router>
//         <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
//           <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(p => !p)} />
//           <main className="flex-1 p-4">
//             <Header />
//             <AppRoutes />
//           </main>
//         </div>
//       </Router>
//     </ThemeProvider>
//   );
// }
export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-xs font-bold">Tailwind Works!</h1>
    </div>
  );
}
