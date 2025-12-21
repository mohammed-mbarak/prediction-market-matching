#!/usr/bin/env sh
# wait-for-it.sh (lightweight POSIX version)

set -e

host="$1"
shift
cmd="$@"

echo "Waiting for $host..."

while ! nc -z ${host%:*} ${host#*:}; do
  sleep 1
done

echo "$host is available, starting..."
exec $cmd
