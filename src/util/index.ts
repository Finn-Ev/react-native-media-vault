export const getVideoDurationString = (duration: number) => {
  duration /= 1000;
  const minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration - minutes * 60).toString();
  if (seconds.length === 1) seconds = `0${seconds.toString()}`;

  return `${minutes}:${seconds}`;
};
