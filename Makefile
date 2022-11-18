GIT_DESCR = $(shell git describe --always)
# build output folder
OUTPUTFOLDER = dist
# docker image
DOCKER_REGISTRY = 166568770115.dkr.ecr.eu-central-1.amazonaws.com/aeternity
DOCKER_IMAGE = aeternity/mdw-frontend
DOCKER_TAG = $(shell git describe --always)
K8S_NAMESPACE=mainnet
NUXT_APP_NODE_URL?=https://mainnet.aeternity.io/v3
NUXT_APP_NODE_WS?=wss://mainnet.aeternity.io/mdw/websocket
NUXT_APP_MDW_URL?=https://mainnet.aeternity.io/mdw
NUXT_APP_OTHER_DEPLOYMENTS?=TESTNET@https://explorer.testnet.aeternity.io
NUXT_APP_NETWORK_NAME?=MAIN NET
NUXT_APP_ENABLE_FAUCET?=false
NUXT_APP_FAUCET_API?=https://testnet.faucet.aepps.com/account

.PHONY: list
list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | xargs

clean:
	@echo remove $(OUTPUTFOLDER) folder
	@rm -rf dist
	@echo done

build:
	@echo build release
	npm install && npm run build
	@echo done

docker-build:
	@echo build image
	docker build -t $(DOCKER_IMAGE) \
	--build-arg NUXT_APP_ENABLE_FAUCET="$(NUXT_APP_ENABLE_FAUCET)" \
	--build-arg NUXT_APP_NODE_URL="$(NUXT_APP_NODE_URL)" \
	--build-arg NUXT_APP_NODE_WS="$(NUXT_APP_NODE_WS)" \
	--build-arg NUXT_APP_NETWORK_NAME="$(NUXT_APP_NETWORK_NAME)" \
	--build-arg NUXT_APP_FAUCET_API="${NUXT_APP_FAUCET_API}" \
	--build-arg NUXT_APP_MDW_URL="${NUXT_APP_MDW_URL}" \
	--build-arg NUXT_APP_OTHER_DEPLOYMENTS="${NUXT_APP_OTHER_DEPLOYMENTS}" \
	-f nginx.Dockerfile .
	@echo done

docker-push:
	@echo push image
	docker tag $(DOCKER_IMAGE) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(K8S_NAMESPACE)-$(DOCKER_TAG)
	aws ecr get-login --no-include-email --region eu-central-1 --profile aeternity-sdk | sh
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(K8S_NAMESPACE)-$(DOCKER_TAG)
	@echo done

deploy-k8s:
	@echo deploy k8s
	kubectl -n $(K8S_NAMESPACE) patch deployment $(DOCKER_IMAGE) --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"$(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(K8S_NAMESPACE)-$(DOCKER_TAG)"}]'
	@echo deploy k8s done
