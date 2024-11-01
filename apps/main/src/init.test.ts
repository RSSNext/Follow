import { app, nativeTheme, Notification, shell } from "electron";
import { initializeAppStage0, initializeAppStage1, registerMenuAndContextMenu, registerPushNotifications } from "./init";
import { getIconPath } from "./helper";
import { store } from "./lib/store";
import { updateNotificationsToken } from "./lib/user";
import { logger } from "./logger";
import { registerAppMenu } from "./menu";
import { createMainWindow, getMainWindow } from "./window";
import { PushReceiver } from "@eneris/push-receiver";
import { APP_PROTOCOL } from "@follow/shared/constants";
import { env } from "@follow/shared/env";
import { t } from "./lib/i18n";
import { getRendererHandlers, registerIpcMain } from "@egoist/tipc/main";
import { initializeSentry } from "./sentry";
import { router } from "./tipc";

jest.mock("electron", () => ({
  app: {
    setPath: jest.fn(),
    setAsDefaultProtocolClient: jest.fn(),
    dock: {
      setIcon: jest.fn(),
    },
  },
  nativeTheme: {
    themeSource: "system",
  },
  Notification: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    on: jest.fn(),
  })),
  shell: {
    openExternal: jest.fn(),
  },
}));

jest.mock("./helper", () => ({
  getIconPath: jest.fn(),
}));

jest.mock("./lib/store", () => ({
  store: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock("./lib/user", () => ({
  updateNotificationsToken: jest.fn(),
}));

jest.mock("./logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("./menu", () => ({
  registerAppMenu: jest.fn(),
}));

jest.mock("./window", () => ({
  createMainWindow: jest.fn(),
  getMainWindow: jest.fn(),
}));

jest.mock("@eneris/push-receiver", () => ({
  PushReceiver: jest.fn().mockImplementation(() => ({
    onReady: jest.fn(),
    onCredentialsChanged: jest.fn(),
    onNotification: jest.fn(),
    connect: jest.fn().mockResolvedValue(),
    persistentIds: [],
  })),
}));

jest.mock("@follow/shared/constants", () => ({
  APP_PROTOCOL: "follow",
}));

jest.mock("@follow/shared/env", () => ({
  env: {
    VITE_FIREBASE_CONFIG: JSON.stringify({ apiKey: "test" }),
  },
}));

jest.mock("./lib/i18n", () => ({
  t: jest.fn().mockImplementation((key) => key),
}));

jest.mock("@egoist/tipc/main", () => ({
  getRendererHandlers: jest.fn(),
  registerIpcMain: jest.fn(),
}));

jest.mock("./sentry", () => ({
  initializeSentry: jest.fn(),
}));

jest.mock("./tipc", () => ({
  router: {},
}));

describe("initializeAppStage0", () => {
  it("should set app data path and initialize Sentry", () => {
    process.env.NODE_ENV = "development";
    initializeAppStage0();
    expect(app.setPath).toHaveBeenCalledWith("appData", expect.any(String));
    expect(initializeSentry).toHaveBeenCalled();
  });
});

describe("initializeAppStage1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default protocol client and register IPC main", () => {
    initializeAppStage1();
    expect(app.setAsDefaultProtocolClient).toHaveBeenCalledWith(APP_PROTOCOL);
    expect(registerIpcMain).toHaveBeenCalledWith(router);
  });

  it("should set dock icon if app.dock exists", () => {
    initializeAppStage1();
    expect(app.dock.setIcon).toHaveBeenCalledWith(getIconPath());
  });

  it("should set native theme source based on store appearance", () => {
    store.get.mockReturnValue("dark");
    initializeAppStage1();
    expect(nativeTheme.themeSource).toBe("dark");
  });

  it("should register menu and context menu", () => {
    initializeAppStage1();
    expect(registerAppMenu).toHaveBeenCalled();
  });

  it("should register push notifications", async () => {
    await initializeAppStage1();
    expect(updateNotificationsToken).toHaveBeenCalled();
    expect(PushReceiver).toHaveBeenCalledWith(expect.objectContaining({
      firebase: expect.any(Object),
    }));
  });
});

describe("registerMenuAndContextMenu", () => {
  it("should register app menu and context menu", () => {
    registerMenuAndContextMenu();
    expect(registerAppMenu).toHaveBeenCalled();
  });
});

describe("registerPushNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize PushReceiver and handle notifications", async () => {
    await registerPushNotifications();
    expect(updateNotificationsToken).toHaveBeenCalled();
    expect(PushReceiver).toHaveBeenCalledWith(expect.objectContaining({
      firebase: expect.any(Object),
    }));
  });
});
