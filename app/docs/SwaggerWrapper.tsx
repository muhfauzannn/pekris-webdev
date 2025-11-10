import React from "react";

interface SwaggerUIWrapperProps {
  spec?: object;
  url?: string;
  [key: string]: unknown;
}

// Suppress console warnings for third-party components
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("UNSAFE_componentWillReceiveProps") ||
      message.includes("componentWillReceiveProps") ||
      message.includes("ModelCollapse"))
  ) {
    return;
  }
  originalWarn(...args);
};

const SwaggerUIWrapper: React.FC<SwaggerUIWrapperProps> = (props) => {
  // Use dynamic import to avoid strict typing issues
  const [isLoaded, setIsLoaded] = React.useState(false);
  const SwaggerUIRef = React.useRef<React.ComponentType<
    Record<string, unknown>
  > | null>(null);

  React.useEffect(() => {
    import("swagger-ui-react").then((module) => {
      SwaggerUIRef.current = module.default as React.ComponentType<
        Record<string, unknown>
      >;
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded || !SwaggerUIRef.current) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return React.createElement(SwaggerUIRef.current, props);
};

export default SwaggerUIWrapper;
