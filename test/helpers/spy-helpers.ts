import { Mock } from 'vitest';

export function assertRepositorySpyCalled(
  spy: Mock,
  withArgs: unknown = expect.anything(),
  times = 1,
): void {
  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledTimes(times);
  expect(spy).toHaveBeenCalledWith(withArgs);
}

export function assertRepositorySpyNotCalled(spy: Mock): void {
  expect(spy).not.toHaveBeenCalled();
}
