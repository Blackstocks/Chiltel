import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5174,
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		// Add any build-specific options here if needed
	},
	publicDir: "public", // This is where we'll put our manifest.json
	base: "/",
});
