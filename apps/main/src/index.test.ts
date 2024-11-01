import { app, BrowserWindow } from "electron";
import { initializeAppStage0, initializeAppStage1 } from "./init";
import { createMainWindow, getMainWindow } from "./window";
import { handleUrlRouting } from "./lib/router";
import { setAuthSessionToken, updateNotificationsToken } from "./lib/user";
import { callWindowExpose } from "@follow/shared/bridge";
import { env } from "@follow/shared/env";
import { URL } from "url";

jest.mock("electron", () => ({
  app: {
    requestSingleInstanceLock: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
    whenReady: jest.fn().mockResolvedValue(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    isMinimized: jest.fn(),
    restore: jest.fn(),
    focus: jest.fn(),
    webContents: {
      session: {
        cookies: {
          set: jest.fn(),
        },
      },
    },
    reload: jest.fn(),
  })),
}));

jest.mock("./init", () => ({
  initializeAppStage0: jest.fn(),
  initializeAppStage1: jest.fn(),
}));

jest.mock("./window", () => ({
  createMainWindow: jest.fn(),
  getMainWindow: jest.fn(),
}));

jest.mock("./lib/router", () => ({
  handleUrlRouting: jest.fn(),
}));

jest.mock("./lib/user", () => ({
  setAuthSessionToken: jest.fn(),
  updateNotificationsToken: jest.fn(),
}));

jest.mock("@follow/shared/bridge", () => ({
  callWindowExpose: jest.fn().mockReturnValue({
    clearIfLoginOtherAccount: jest.fn(),
  }),
}));

jest.mock("@follow/shared/env", () => ({
  env: {
    VITE_API_URL: "https://api.example.com",
    VITE_WEB_URL: "https://web.example.com",
  },
}));

describe("bootstrap", () => {
  let mainWindow;

  beforeEach(() => {
    jest.clearAllMocks();
    mainWindow = new BrowserWindow();
    (getMainWindow as jest.Mock).mockReturnValue(mainWindow);
  });

  it("should initialize the app and create the main window", async () => {
    const bootstrap = require("./index").default;
    await bootstrap();

    expect(initializeAppStage0).toHaveBeenCalled();
    expect(initializeAppStage1).toHaveBeenCalled();
    expect(app.requestSingleInstanceLock).toHaveBeenCalled();
    expect(app.on).toHaveBeenCalledWith("second-instance", expect.any(Function));
    expect(app.whenReady).toHaveBeenCalled();
    expect(createMainWindow).toHaveBeenCalled();
  });

  it("should handle second instance and open URL", async () => {
    const bootstrap = require("./index").default;
    await bootstrap();

    const secondInstanceCallback = (app.on as jest.Mock).mock.calls.find(
      (call) => call[0] === "second-instance"
    )[1];

    secondInstanceCallback({}, ["", "https://example.com"]);

    expect(mainWindow.isMinimized).toHaveBeenCalled();
    expect(mainWindow.restore).toHaveBeenCalled();
    expect(mainWindow.focus).toHaveBeenCalled();
    expect(handleUrlRouting).toHaveBeenCalledWith("https://example.com");
  });

  it("should handle auth URL and set session cookies", async () => {
    const bootstrap = require("./index").default;
    await bootstrap();

    const handleOpen = (await import("./index")).handleOpen;
    await handleOpen("https://auth?token=123&userId=456");

    expect(setAuthSessionToken).toHaveBeenCalledWith("123");
    expect(mainWindow.webContents.session.cookies.set).toHaveBeenCalledTimes(2);
    expect(callWindowExpose(mainWindow).clearIfLoginOtherAccount).toHaveBeenCalledWith("456");
    expect(mainWindow.reload).toHaveBeenCalled();
    expect(updateNotificationsToken).toHaveBeenCalled();
  });
});
