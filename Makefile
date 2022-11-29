GIT_DESCR = $(shell git describe --always)
# build output folder
OUTPUTFOLDER = dist
# docker image
DOCKER_REGISTRY = 166568770115.dkr.ecr.eu-central-1.amazonaws.com/aeternity
DOCKER_IMAGE = aeternity/mdw-frontend
DOCKER_TAG = $(shell git describe --always)

all: docker-build

.PHONY: list
help:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | xargs

clean:
	@echo remove $(OUTPUTFOLDER) folder
	@rm -rf dist
	@echo done

build:
	@echo build release
	npm install && npm run build
	@echo done

# build with default args, which can be overridden from the env in `docker run --env-file=<network>.env`
docker-build:
	@echo build node server image
	docker build -t $(DOCKER_IMAGE) -f Dockerfile .
	@echo done

# build static server container
docker-static:
	@echo build nginx image
	docker build -t $(DOCKER_IMAGE) \
	--build-arg NUXT_APP_NETWORK_NAME="$(NUXT_APP_NETWORK_NAME)" \
	--build-arg NUXT_APP_NODE_URL="$(NUXT_APP_NODE_URL)" \
	--build-arg NUXT_APP_NODE_WS="$(NUXT_APP_NODE_WS)" \
	--build-arg NUXT_APP_MDW_URL="${NUXT_APP_MDW_URL}" \
	--build-arg NUXT_APP_OTHER_DEPLOYMENTS="${NUXT_APP_OTHER_DEPLOYMENTS}" \
	--build-arg NUXT_APP_ENABLE_FAUCET="$(NUXT_APP_ENABLE_FAUCET)" \
	--build-arg NUXT_APP_FAUCET_API="${NUXT_APP_FAUCET_API}" \
	--build-arg NUXT_APP_API_DOCS="${NUXT_APP_API_DOCS}" \
	-f nginx.Dockerfile .
	@echo done
