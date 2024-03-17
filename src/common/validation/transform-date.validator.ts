import { Transform } from 'class-transformer';

export function TransformDate() {
  const toPlain = Transform(({ value }) => value, {
    toPlainOnly: true,
  });

  const toClass = Transform(({ value }) => new Date(value), {
    toClassOnly: true,
  });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}
