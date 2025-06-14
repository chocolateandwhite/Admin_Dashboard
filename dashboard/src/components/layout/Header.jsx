import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex justify-end mb-4">
      <Button onClick={toggleTheme} variant="outline" size="icon">
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
