class StreamFactory:
    def __init__(self):
        self.multiplexers = {}

    def __call__(self, stream_url):
        if stream_url not in self.multiplexers:
            self.multiplexers[stream_url] = StreamMultiplexer()

        return self.multiplexers


class StreamMultiplexer:
    def __init__(self):
        self.queues = []

    def __call__(self):
        pass
