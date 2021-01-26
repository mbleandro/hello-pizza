#!/bin/bash
docker-compose -f docker/compose/test.yml run hello-pizza unittests.sh
exitcode=$?
docker-compose -f docker/compose/test.yml down
exit $exitcode
