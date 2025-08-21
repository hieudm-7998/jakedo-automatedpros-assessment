'use client';

type LoaderProps = {
  size?: number;
};

export default function Loader({ size = 20 }: LoaderProps) {
  const dimension = `${size}px`;

  return (
    <svg
      className='fractal-loader fractal-loader--xs'
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        maxWidth: dimension,
        minHeight: dimension,
        maxHeight: dimension,
        display: 'block',
      }}
      display='block'
      preserveAspectRatio='xMidYMid'
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g transform='translate(50 50)'>
        <g>
          <animateTransform
            attributeName='transform'
            calcMode='discrete'
            dur='3.5s'
            keyTimes='0;0.25;0.5;0.75;1'
            repeatCount='indefinite'
            type='rotate'
            values='0;90;180;270;360'
          />
          <path d='M-40 0a40 40 0 1 0 80 0' fill='#ffc6e7'>
            <animate
              attributeName='fill'
              calcMode='discrete'
              dur='3.5s'
              keyTimes='0;0.24;0.49;0.74;0.99'
              repeatCount='indefinite'
              values='#ffc6e7;#fff29b;#adface;#d9beff;#ffc6e7'
            />
          </path>
          <path d='M-40 0a40 40 0 0 1 80 0' fill='#fff29b'>
            <animate
              attributeName='fill'
              calcMode='discrete'
              dur='3.5s'
              keyTimes='0;0.25;0.5;0.75;1'
              repeatCount='indefinite'
              values='#fff29b;#adface;#d9beff;#ffc6e7;#fff29b'
            />
          </path>
          <path d='M-39 0h78' stroke='#ff3eae' strokeWidth='2'>
            <animate
              attributeName='stroke'
              dur='3.5s'
              keyTimes='0;0.124;0.125;0.25;0.374;0.375;0.5;0.624;0.625;0.75;0.874;0.875;1'
              repeatCount='indefinite'
              values='#ffc6e7;#ff3eae;#ffe220;#fff29b;#ffe220;#35f387;#adface;#35f387;#8b38ff;#d9beff;#8b38ff;#ff3eae;#ffc6e7'
            />
          </path>
          <path d='M-40 0a40 40 0 0 1 80 0Z' fill='#ff3eae'>
            <animate
              attributeName='fill'
              dur='3.5s'
              keyTimes='0;0.124;0.125;0.25;0.374;0.375;0.5;0.624;0.625;0.75;0.874;0.875;1'
              repeatCount='indefinite'
              values='#ffc6e7;#ff3eae;#ffe220;#fff29b;#ffe220;#35f387;#adface;#35f387;#8b38ff;#d9beff;#8b38ff;#ff3eae;#ffc6e7'
            />
            <animateTransform
              attributeName='transform'
              dur='0.875s'
              keyTimes='0;0.5;0.999;1'
              repeatCount='indefinite'
              type='scale'
              values='1 1;1 0;1 -1;1 1'
            />
          </path>
        </g>
      </g>
    </svg>
  );
}
