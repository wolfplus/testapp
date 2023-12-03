####################################
# Deploy 						  						 #
####################################

DEPLOY_TO = preprod
DIST_PATH ?= ../www
BUILD_PATH ?= build

deploy: ask_confirmation prepare
	ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -i ansible/$(DEPLOY_TO) deploy/$(DEPLOY_TO).yml

ask_confirmation:
	$(eval GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD))
	@echo "Your current branch is \033[0;34m$(GIT_BRANCH)\033[0m"
	@echo "You really want to deploy on \033[0;31m$(DEPLOY_TO)\033[0m now? [y/N] " && read ans && [ $${ans:-N} = y ]

prepare:
	rm -rf ${DIST_PATH} && npm install --legacy-peer-deps && npm run ${BUILD_PATH}
