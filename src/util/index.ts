export const getVideoDurationString = (duration: number) => {
  duration /= 1000;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60);
  return `${minutes}:${seconds}`;
};
