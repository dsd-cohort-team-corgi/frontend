type RepeatTsxNumOfTimesType = {
  times: number;
  Element: React.ComponentType;
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
