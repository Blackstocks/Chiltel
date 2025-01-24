import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
  
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess("Login successful!");
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    };
  
    const handleInputChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                className="absolute top-8 right-3 text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
