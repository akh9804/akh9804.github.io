import {format, parseISO} from 'date-fns';

interface Props {
  dateString: string;
  className?: string;
}

export default function Date({dateString, className}: Props) {
  const date = parseISO(dateString);

  return (
    <time className={className} dateTime={dateString}>
      {format(date, 'LLLL d, yyyy')}
    </time>
  );
}
