from gevent import queue


class StreamFactory:
    def __init__(self):
        self.multiplexers = {}

    def __call__(self, stream_url):
        if stream_url not in self.multiplexers:
            self.multiplexers[stream_url] = StreamMultiplexer(stream_url)

        return self.multiplexers[stream_url]


class StreamMultiplexer:
    def __init__(self, stream_url):
        self.stream_url = stream_url
        self.producer = False
        self.queues = []

    def __call__(self):
        x = queue.Queue()
        self.queues.append(x)

    def producer(self):
        if self.producer:
            return


