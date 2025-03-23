export interface IVendorAPIParams {}

export interface IChannel {
  _id: string;
  channelType: string;
  channelStatus: string;
  channelConfig: {
    domain: string;
    name: string;
  };
}
