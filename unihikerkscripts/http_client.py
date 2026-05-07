import urequests as requests


class HttpClient:
    def __init__(self, network_manager):
        self._net = network_manager

    def post_json(self, url, payload):
        if not self._net.is_connected():
            return False, "no_wifi"
        try:
            response = requests.post(url, json=payload)
            text = response.text
            response.close()
            return True, text
        except Exception as exc:
            return False, str(exc)
