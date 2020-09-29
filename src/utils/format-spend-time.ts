export default function formatSpendTime(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)} s`;
  } else {
    return `${ms} ms`;
  }
}
