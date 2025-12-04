import api from "./api";

export const visualService = {
  // Generate image
  generateImage: async (imageData) => {
    const response = await api.post("/generate-image", imageData);
    return response.data;
  },

  // Process image
  processImage: async (imageData) => {
    const response = await api.post("/process-image", imageData);
    return response.data;
  },

  // Create variants
  createVariants: async (variantData) => {
    const response = await api.post("/create-variants", variantData);
    return response.data;
  },

  // Save visual content
  saveVisual: async (visualData) => {
    const response = await api.post("/save", visualData);
    return response.data;
  },

  // Start A/B test
  startAbTest: async (testData) => {
    const response = await api.post("/ab-test/start", testData);
    return response.data;
  },

  // Check A/B test
  checkAbTest: async (testData) => {
    const response = await api.post("/ab-test/check", testData);
    return response.data;
  },

  // Get A/B test by current time
  getAbTestByCurrentTime: async () => {
    const response = await api.get("/abtest/by-current-time");
    return response.data;
  },

  // Generate carousel images
  generateCarouselImages: async (carouselData) => {
    const response = await api.post("/generate-carousel", carouselData);
    return response.data;
  },

  // List to check for testing
  listToCheck: async (checkTime = null) => {
    const response = await api.post("/list-to-check-testing", { checkTime });
    return response.data;
  },

  // Send best variant email
  sendBestVariantEmail: async (emailData) => {
    const response = await api.post("/send-best-variant-email", emailData);
    return response.data;
  },

  // Forward to webhook
  forwardToWebhook: async (webhookData) => {
    const response = await api.post("/forward-to-webhook", webhookData);
    return response.data;
  },

  // Get Active A/B Tests
  getActiveAbTests: async () => {
    const response = await api.get("/ab-test/active");
    return response.data;
  },

  // Get Running Tests
  getRunningTests: async () => {
    const response = await api.get("/ab-test/running");
    return response.data;
  },

  // Get A/B Test Results
  getAbTestResults: async () => {
    const response = await api.get("/ab-test/results");
    return response.data;
  },

  // Get Performance Analytics
  getPerformanceAnalytics: async () => {
    const response = await api.get("/ab-test/analytics");
    return response.data;
  },

  // Generate A/B test variants using AI
  generateAbTestVariants: async (variantData) => {
    const response = await api.post("/ab-test/generate-variants", variantData);
    return response.data;
  },
};

