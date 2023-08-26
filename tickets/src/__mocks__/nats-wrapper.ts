export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (channelName: string, data: string, callback: () => void) => {
          callback();
        }
      )
  }
};
