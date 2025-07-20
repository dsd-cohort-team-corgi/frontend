type RepeatTsxNumOfTimesType = {
  times: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Element: React.ComponentType<any>;
  className?: string;
};

export default function repeatComponentXTimes({
  times,
  Element,
  className,
}: RepeatTsxNumOfTimesType) {
  return (
    <div className={className}>
      {Array.from({ length: times }).map((_, index) => (
        <Element key={`${index + 1}-of-${times}-elements`} />
      ))}
    </div>
  );
}
