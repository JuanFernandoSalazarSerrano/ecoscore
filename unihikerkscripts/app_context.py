class AppContext:
    def __init__(self, screen, buttons, network_manager, http_client, config):
        self.screen = screen
        self.buttons = buttons
        self.net = network_manager
        self.http = http_client
        self.config = config

    def ensure_wifi(self):
        return self.net.connect(
            self.config.WIFI_SSID,
            self.config.WIFI_PASSWORD,
            self.config.WIFI_TIMEOUT_S,
        )
