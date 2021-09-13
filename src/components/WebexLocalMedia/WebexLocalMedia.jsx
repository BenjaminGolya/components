import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../generic/Spinner/Spinner';

import WebexAvatar from '../WebexAvatar/WebexAvatar';
import webexComponentClasses from '../helpers';
import {PHONE_LARGE} from '../breakpoints';
import {
  useElementDimensions,
  useMe,
  useMeeting,
  useStream,
} from '../hooks';

/**
 * Webex Local Media component displays the user's local video or local share.
 *
 * @param {object} props  Data passed to the component
 * @param {string} props.className  Custom CSS class to apply
 * @param {string} props.mediaType  Type of local media to display
 * @param {string} props.meetingID  ID of the meeting from which to obtain local media
 * @param {string} props.preview  Preview type of local media to display
 * @param {object} props.style  Custom style to apply
 * @returns {object} JSX of the component
 */
export default function WebexLocalMedia({
  className,
  mediaType,
  meetingID,
  preview,
  style,
}) {
  const [mediaRef, {width}] = useElementDimensions();
  const {localVideo, localShare} = useMeeting(meetingID);
  const ref = useRef();
  const {ID} = useMe();

  let stream;

  switch (mediaType) {
    case 'video':
      stream = localVideo.stream;
      break;
    case 'screen':
      stream = localShare?.stream;
      break;
    default:
      break;
  }

  const showStream = preview ? localVideo.preview : stream;

  useStream(ref, showStream);

  const cssClasses = webexComponentClasses('local-media', className, {
    desktop: width >= PHONE_LARGE,
    'no-media': !showStream,
  });
  const disabledVideo = ID ? <WebexAvatar personID={ID} displayStatus={false} /> : <Spinner />;

  return (
    <div ref={mediaRef} className={cssClasses} style={style}>
      {
        // eslint-disable-next-line jsx-a11y/media-has-caption
        showStream ? <video ref={ref} playsInline autoPlay /> : disabledVideo
      }
    </div>
  );
}

WebexLocalMedia.propTypes = {
  className: PropTypes.string,
  mediaType: PropTypes.oneOf(['video', 'screen']),
  meetingID: PropTypes.string.isRequired,
  preview: PropTypes.bool,
  style: PropTypes.shape(),
};

WebexLocalMedia.defaultProps = {
  className: '',
  mediaType: 'video',
  preview: false,
  style: undefined,
};
