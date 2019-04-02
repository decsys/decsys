/**
 * Get the private IP address of the client the browser is running this code on
 */
export default () =>
  new Promise(resolve => {
    const pc = new window.RTCPeerConnection();
    const nop = () => {};
    const addresses = {};
    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

    const storeIp = ip => addresses[ip] || (addresses[ip] = true);

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(sdp => {
      sdp.sdp
        .split("\n")
        .forEach(
          line =>
            line.indexOf("candidate") < 0 ||
            line.match(ipRegex).forEach(storeIp)
        );

      pc.setLocalDescription(sdp, nop, nop);
    }, nop);

    //listen for candidate events
    pc.onicecandidate = ice =>
      ice && ice.candidate
        ? ice.candidate.candidate &&
          ice.candidate.candidate.match(ipRegex).forEach(storeIp)
        : resolve(Object.keys(addresses));
  });
