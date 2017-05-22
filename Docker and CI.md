# Docker
[toc]

## Vocabulary

1. **Daemon** is a computer program that runs as a background process, rather than being under the control of a user. Traditionally, such programs end with the letter *d*, such as *sshd* or *syslogd*.

2. **Image** an immutable file that is, in essence, a snapshot of a container. It can be thought of as analogous to a *class*, with the *container* being an instance of that class.

3. **Container** is a collection of all the binary code and the dependencies necessary to run an application. It is created from an image.

2. **Registry** is where we store images. The registry can be on our local computer, or can be a public registry, such as Docker Hub.

3. **Repository** is where, inside the registry, an image is stored. This terminology is very similar to GitHub.  It is a collection of different images bearing the same name, but having different tags, which normally correspond to version numbers.


## Introduction

### Virtualization

1. **Virtualization** is the process of abstracting an application, OS, *etc.*, away form the true underlying hardware or software, to allow it to run over different underlying hardware (or OS).  Two common methods of virtualization are *hypervisor based* and *container based*.

### Hypervisor Based

1. **Hypervisor**: A hypervisor is a software/firmware/hardware that creates and runs virtual machines. The **host** is the machine on which everything is running, and the **guest** is the virtual machine. There may be many guests running on a host machine. For example, there could be a single physical machine running its OS, on which is running an Ubuntu OS with its own app, and a Debian OS with its own app, etc.

    a. A **Type 1** hypervisor is run directly on the hardware, and is known as a "bare metal hypervisor."
	
    b. A **Type 2** hypervisor operates as an application on top of an existing operating system.
	
2. Hypervisor products include VMware, Virtual Box, etc.
	
3. Although this system is much more efficient than having a separate physical server for each app, it still results in a large amount of duplication of OS resources.  Also, the applications might not be portable.

### Container Based

1. In a *container-based* virtualization environment (such as Docker), there is an underlying OS, over which is a container-engine layer, over which are **containers**, each of which has its application specific code, but which share the OS.

2. Containers are extremely portable, as they are self-contained applications. In addition, they are cost-effective, since many more containers can run on a specified amount of equipment than can run applications, each running their own virtual operating systems.

### Docker System

1. In general, the *client* will enter commands that will be handled by the *Docker daemon*. The daemon will create **containers** based on **images**, many of which may be downloaded from the Docker Hub registry.

    **NOTE**: The *Docker daemon* is often referred to as the *Docker Engine* or *Docker Server*.

2. In a typical installation, the Docker Client and the Docker Daemon are running on the same physical machine, the *Docker Host*, but the Docker Client can be operating remotely.

3. Although Docker now has a MacOS version, it really is just creating a lightweight Linux VM to run the Docker Daemon on the Mac computer.

### Docker Hub
1. An important part of the Docker system is the Docker Hub website.(https://hub.docker.com). 

2. One important service provided by Docker Hub is the certification of official repositories. Any user can create repositories and, if they are public, we can access them; however, major repos such as operating systems will likely have official repos, so we know we are getting what we think we are.
 
### Installation

1. On an up-to-date Windows or MacOS system, it is pretty easy to set up by going to docker.com and downloading *Docker for Mac* (or Windows) and following the instructions.  Upon completion, there will be a little whale icon in the top bar.

2. To see general Docker information, type at the command line:
    ```
    docker info
    ```
    
### Images and Containers

1. The **image** and the **container** are two of the most important Docker concepts.  An *image* is a read-only template, which is created using the command:
   ```
   docker build
   ```
    Images may be created by us or by other docker users.
	
2. Images are typically composed of layers of other images.

3.	Images are stored in a Docker registry, such as *Docker Hub*.

4.	A *container* may be thought of as a specific instance of an image.   They should be very lightweight and portable encapsulations of an environment in which to run an application.

5.	The container is created from an image, and contains all the binaries and dependencies needed to run an application.

### Foreground vs Detached

1. When a container is running in the **foreground**, this means that Docker starts the process in the container, and connects the *console* to the *stdin*, *stdout*, and *stderr*.  **This is the default mode for Docker.**

2. However, most of the time, we will want to run the container in **detached mode.**  This allows the container to run in the background, and exit when the root process exits. In order to run in the background, use the **-d** flag with the *run* command.

## Creating a Basic First Application
1. In this section, we will go through the steps to build a first container. It will use a repository called *busybox*, which is a small image containing Linux and an array of common Unix utilities.

2. Step One: Go to Docker Hub and search the repos for "busybox". This should bring up a long list of repos; however, the first one should be marked "official."

3. Step Two: We do not need any special steps to get a copy of our image onto our local registry. All we do is use the **run** command to start the container, and docker will search for the image locally and, if not available, get it from the remote registry. So, to get our busybox container up and running, we can enter the following at the command line:
    ```
    docker run busybox:latest
    ```
    Remember that images are identified by their **name** and **tag**, separated by a colon. If the designation is *latest*, docker will use the latest version. Otherwise, the tag will usually be a version number, *e.g.*, 1.24.

4. We can also specify a command to run in the container, as well as any arguments for that command. So, our full command might be:
    ```
    docker run busybox:latest echo "goodbye, cruel world"
    ```
5. The above doesn't do a whole bunch. It downloads the image (won't have to the next time), opens the container, runs our command, and then exits. To have more fun, we will want to run an interactive container (*i.e*., one that doesn't just run a command and instantly shut down). To do so, we should use the **-i flag** (starts an interactive container) and the **-t flag** (creates a pseudo-TTY that attaches stdin and stdout). So, for example:
    ```
    docker run -it busybox:1.24
    ```
    This should be entered **without** any commands. Then, we will have access to the system, which we can close down with:
    ```
    exit
    ```

## Some Basic Docker Commands


### Containers

#### run
1. As seen in the example above, to create a container using a specified image, we use the following command:
    ```
    docker run [image name or id]
    ```		
    The first time we do this with an image, docker will look for the image locally, be unsuccessful at finding it, then download it from Docker Hub. It will then run the command, and close down immediately.
    
2. When a container is created using *run*, it is a new and different container from other containers.  So, for example, if I create a container from the busybox image and create a new folder in it, then exit and create a new container from the busybox image, the second busybox container will not have the file that I added to the first container.

3. Note that when the *run* command is executed, it returns a long id for the container. A short slice of this id is shown as the CONTAINER ID in the table of open containers returned by *docker ps*.

#### run -p
1. A common flag for the *run* command is **-p**. With this flag, we can map a browser port to a port in the container.  For example, the *tomcat server* runs by default on port 8080.  However, if we wish to access it on a different localhost port, we can use the following:
    ```
    docker run -it --rm -p 3142:8080 tomcat:8.0
    ```

#### start, attach
1. If a container already exists, but has been exited, crashed, *etc.*, we can get it runing again with the **start** command, followed by the container id or name. 

2. To see a list of containers **currently running**, enter the command:
    ```
    docker start [container id]
    ```

3. Note, however, that this will start everything up in detached mode. To connect the container, follow the start command with the **attach** command:
    ```
    dockeer start [container id] && docker attach [container id]
    ```

#### exit
1. To exit the interactive container, type the following at the command line:
    ```
    exit
    ```
    Once a container has run and exited, it remains in the list of containers, until removed.

#### ps, ps -a
1. To see a list of all **currently running** Docker containers, enter the following at the command line:
    ```
    docker ps
    ```
2. To also see the containers that exist, but are not currently running, enter the following at the command line:
    ```
    docker ps -a
    ```
    
#### rm
1. To remove a container (*i.e.*, shut it down for good), enter the following at the command line:
    ```
    docker rm [one or more container ids]
    ```

2. **rm** is also used as an added command to the **run** command.  The following will cause a container to be removed as soon as it exits:
    ```
    docker run --rm [image name]
    ```

#### sleep
1. This is not actually a docker specific command, but a part of linux. Followed by a number (of seconds), it is used to delay a process for the specified amount of time. For example, in the command:
    ```
    docker run -d busybox:latest sleep 1000
    ```
    we will start running the specified container in the background, but will delay its closing for the specified time of 1000 seconds.
    
#### name
1. We can select a name for our container, by using the **--name** command:
    ```
    docker run --name [desired name] [image]
    ```
    In the absence of this command, docker just makes up a name.


#### inspect
1. To see low-level information about a container, we can use the **inspect** command:
    ```
    docker inspect [container ID]
    ```

#### logs
1. To see the log information for the container, simply run the command:
    ```
    docker logs [container ID]
    ```


### Images

#### images
1. To see a list of all images contained in the local registry, type the following at the command line:
    ```
    docker images
    ```
#### history
1. To see the layers that are included in a particular image, run from the command line the command:
    ```
    docker history [image]
    ```

## Docker Image Layers

1. A **docker image** is made up of a series of read-only layers that represent file system differences.  For example, an image will have an underlaying layer, then will typically have a base layer of an operating system, such as Ubuntu or Debian, then might have other images built on top, such as Apache server and emacs (a text editor). Then, on top, there will be a writable *container*.

2. Remember, if we want to see the layers that make up an image, we should include the **history** command.
		
3. Any changes will be made to the lightweight, r/w **container layer**.  The underlying image is read-only. So, many containers can have access to a particular image, but maintain their own, unique, data state.

### Creating a Docker Image

1. There are **two methods** for creating a Docker Image. The first is to make changes to an image in a Docker container, then commit those changes, so they become part of the new image. The second way is to automate the process in a file called a **Dockerfile**.

#### Manual Build Example
1. In the following example, we will build a simple image, consisting of two layers. First, we will git it a Debian flavor of the Linux operating system, then add git to it.

2. First, let's create the Docker container running the Debian OS as follows:
    ```
    docker run -it debian:jessie
    ```
    **Note**: Don't run the *--rm* in the above command, as we will need the container to persist after it is modified, so we can save it as a new image.

3. At the command line for the container (since we used the -it flags), we can use a Debian utility called *apt-get* to install git:
    ```
    apt-get update && apt-get install -y git
    ```
    **Note**: The -y flag just tells the apt-get process to respond yes to every question along the way in the install process.
	
4. At this point, we have a container that differs from its parent image, in that it has git installed.  We need to **commit** the changes we have made to a **new image** by the following command:
    ```
    docker commit [container_ID] [repository_name:tag] 
    ```
    So, for example, in this case the command might be (adding my Docker Hub account name:
    ```
    docker commit 01b4af71324e cjordanball/debian:0.1.0
    ```
    **Note**: the container\_ID is determined from running *docker ps -A*, and the repository name could be in my local registry as well as the DockerHub registry.

#### Dockerfile Example
1. A **Dockerfile** is a text file that contains the instructions necessary to assemble an image. Each instruction creates a new image layer.

2. The Dockerfile must be named *Dockerfile* (with uppercase D), with no extension.


3. The first line of the Dockerfile will tell what the base image is, and begins *FROM* (commands are not case-sensitive, but convention is to make them uppercase).
    ```
    FROM debian:jessie
    RUN apt-get update
    RUN apt-get install -y git
    RUN apt-get install -y vim
    CMD [include commands we want to run when the container starts
    ```
    The above Dockerfile will start with a Debian layer, then check for updates, then add git, then add the vim text editor.  In order to make it run, we use the **build** command.
    
    Note that the **-y** prompt is important in the commands included in the Dockerfile, because they will be running without any user input, so they will have to automatically answer "yes" to any questions asked in the process of installing.

4. The **build** command requires a path to the **build context**.  When the build starts, the docker client packs all the files in the Build Context into a tarball, then transfers that tarball file to the daemon.  Also, by default, Docker searches for the Dockerfile in the Build Context path.  If the Dockerfile is not there, one can specify its location with the **-f** option.
    ```
    docker build -t cjordanball/dockbuilddebian ./directory
    ```
    The **-t** flag tags the image with the given name:tag.  


5. In performing the build, for each step Docker creates a temp container, adds the next layer, then closes that container and opens a new one for the next step.

#### Additional Dockerfile
1. **Chaining Run Instructions:** As noted above, for each RUN instruction in the Dockerfile, the *build* command will create a new Docker temporary container and image. It is more efficient to have a single RUN command chaining together multiple steps. For the above example, we can chain the *apt-get update* and *apt-get install* commands, and then chain the items to install, as follows:
    ```
    FROM debian:jessie
    RUN apt-get update && apt-get install -y \
			git \
			vim


::: danger
Rest here
::::
####Using a Dockerfile





		



####More Dockerfile



2.	**Put Multi-Line Arguments in Alphabetical Order:** This will make it easier to avoid unnecessary duplication.

3.	**CMD Instruction:** This is another common instruction in the Dockerfile, and it tells Docker what command should be run when the container starts up.  If no CMD instruction is given, Docker will use the default command defined in the base image.  Note, however, that this is merely a default, and a different command can be set when the container is created, using the *run* command.

4.	The CMD instruction should be in exec form, with an array containing the command, followed by any arguments.  For example:

		CMD ["echo", "hello world"]
		
5.	Another reason to chain the *apt-get update* instruction with *install* instructions has to do with the **Docker cache.**  If a build step has already been performed, Docker will not redo it in a subsequent build, but will use the cached version of that step. This makes the build much faster, but could lead to the version falling behind and not getting updated, if the update command is left on its own.

6.	An alternative is to turn off the use of cache, as follows:

		docker build -t cjordanball/debian . --no-cache=true

7.	The **COPY** instruction copies new files or directories from the Build Context and adds them to the file system of the container. So, for example, if we have a file named *test.txt* in our Build Context directory, and want to have it in our container at */src/test.txt*, we should place the following in the Dockerfile:

		COPY abc.txt /src/abc.txt
		
8.	The COPY instruction is a special, simple case of the **ADD** instruction, which allows us to do other things, such as download a file from a remote location and add it to the image or automatically unpack compressed files.  However **COPY** is preferred, unless **ADD** is necessary.

9.	The **WORKDIR** instruction sets the working directory for any RUN, COPY, CMD, ENTRYPOINT, and ADD instructions that follow it.

####Docker Hub

1.	We can store images on Docker Hub, which operates in a manner similar to Github.

2.	To update the name of an image, we can use the **tag** command, as follows:

		docker tag [image ID] [new name:tag]
		
3.	To push an image to Docker Hub, it must have a name in the form of:

		acctUsername/imageName
		//for example: cjordanball/node-web-app
		
4.  Then, we should type from the command line:

		docker login --username=cjordanball
		
	where I am using my username. Then I enter my password.  After that, to send an image to Docker Hub, use the command:
	
		docker push [image name]/[tag]


###Example: Dockerize a Simple Node Application

####Create a Simple Node App

1.  First, we will create a basic "Goodbye, Cruel World" application using Express, with the following *package.json* file:

		{
  			"name": "docker_app",
 	 		"version": "0.0.1",
  			"description": "Node.js on Docker",
  			"author": "CJB3",
  			"main": "index.js",
  			"scripts": {
    			"start": "nodemon index.js"
  			},
  			"dependencies": {
   		 		"express": "^4.13.3"
  			},
  			"devDependencies": {
    			"nodemon": "^1.11.0"
  			}
		}

2.	Next, we create an *index.js* file, which uses Express to handle two routes:

		'use strict';
		const express = require('express');

		//constants
		const PORT = 3142;

		//our app
		const app = express();
		app.get('/', (req, res) => {
  			console.log('root');
  			res.send('Goodbye, Cruel World!');
		});

		app.get('/test', (req, res) => {
  			res.send(`<h1>This is the test of tests!</h1>`);
		})

		app.listen(PORT);
		console.log(`Running on http://localhost:${PORT}`);
		
3.	Next, we create a Dockerfile for the project, to tell Docker how to assemble our image:

	a.	We first designate the version of Node we want to run:
	
		FROM node:7
		
	b.	Next, we can create a directory to hold the app and designate it as the working directory:
	
		RUN mkdir -p /usr/src/app
		WORKDIR /usr/src/app
		
	c.	Next, copy the *package.json* file into the working directory and then run *npm install*
	
		COPY package.json /usr/src/app/
		RUN npm install
	
	**NOTE:** It is a great idea to COPY the *package.json* file and then RUN npm install on it *before* copying the rest of the application folder.  That way, the cache can be used on rebuilds for the node modules.
	
	d.	Next, send our source code ot the Docker image using COPY:
	
		COPY . /usr/src/app
		
	e.	Next, use the EXPOSE instruction to have our port mapped:
	
		EXPOSE 3142
		
	f.	Finally, define the start-up command to run:
	
		CMD ["npm", "start"]

4.	Create a **.dockerignore** file to tell docker what not to copy:

		node_modules
		npm-debug.log
		
5.	At this point, we can create our image:

		docker build -t cjordanball/node_app .
		
6.	To run the image, we must map the port to the one exposed by Docker (even if it is the same):

		docker run -p 8000:3142 -d cjordanball/node_app
		
7.	We can see the output of the application by running the *docker logs* command:

		docker logs [container ID]
		
8.	Also, when we create the container with Node from the Docker Hub, we are actually getting Node running in a Linux OS.  We can go into the file system with the following command:

		docker exec -it cjordanball/node_app /bin/bash

###Linking Containers

####General - Manual Linking

1.	Docker containers can be linked, so that they can communicate with each other internally, without exposing a port. For example, we can have a Data Server such as Redis in one container, and a web server in another container.  We can link them so they communicate.

2.	In our example, let's have our application in one container, which we can refer to as the *recipient*.  In another container, we place Redis, and we refer to this container as the *source*.

3.	As a first step, we will use the *run* command to create our redis container, giving it the name *redis*. The naming is necessary so that we have a reference to the container when we make our link.

		//the second redis indicates the image
		docker run -d --name redis redis:3.2.0 

4.	Once we confirm that the Docker image is up and running, we build our application image, then use the *run* command to build the recipient container, as follows:

		docker run -d -p 3142:3142 --link redis dockerapp:v0.0.3	
 The **--link redis** instruction links the container labelled *redis* to the new recipient container.
 
 5.	If we look into the containers using the *exec* command, we see that, in the /etc/hosts file, an IP address is assigned to the *redis* container.

####Docker Compose

1.	The above approach of manually linking containers would quickly become unwieldy as the number of containers involved grows. In order to keep track of everything, we can use a tool called **Docker Compose**. This allows us to run a single command to create and start all the services in our configuration.

2.	We define all our services in a file entitled **docker-compose.yml**. Then we can start everything with a single command:

		docker-compose up
		
3.	When using Docker-Compose, linking is not required, because each service can communicate with each other service by name. As an example docker-compose.yml file:

		version: '2'
		services:
    	  dockerapp:
            build: .
            ports:
              - "5000:5000"
            volumes:
              - ./app:/app
         redis:
           image: redis:3.2.0

	**Note:** The version should be '2.' This allows us to forgo linking.
	
	**Note:** Each service should get an entry.
	
	**Note:** The volumes allows us to direct the code to from the container to the host machine. It should be in the form *host directory : container directory*.  So, we should remove the *copy* instruction from the Dockerfile.
	
4.	When we run the *docker-compose up* command, we can attach the *-d* command to run it in the background.

5.	To see the status of the containers being managed by docker-compose, we should run:

		docker-compose ps
		
6.	We can also see information by the command:

		docker-compose logs
		
	**NOTE:** Append the container name to the above command to see the output for a specific container.
	
	**NOTE:** Add the **-f** flag to have the log output as it continues to grow.

7.	To stop all the running containers, without removing them:

		docker-compose stop
		
8.	We can restart these containers again with either:

		docker-compose start
		docker-compose up
		
9.	If we make a modification to our code (such as in the Dockerfile), we cannot use *docker-compose up* to rebuild the container with the changes, because Docker will see the image already exists. To force a rebuild, use the command:

		docker-compose build
		
###Testing with Docker

1.	First, in the container, add the following line to the Dockerfile to add jasmine-node testing to our application:

		RUN npm install -g jasmine-node
		
2.	In the application, create a *spec* folder and files containing the tests.

3.	Make sure in the *package.json* file that we set our testing script:

		"scripts": {
			"test": "jasmine-node spec",
			"start": "node index.js"
		}
	
4.	Add a file to our project, *docker-compose.test.yml*, with the following content:

		version: '2'
		  services:
		    bazoom:
		      build: .
		      ports:
		        - "3000:3000"
		      entrypoint: jasmine-node spec
		
5.	Run the tests with the following:

		docker-compose -f docker-compose.test.yml up --build
		
6.	And remove the container from the list of dormant containers with:

		docker-compost -f docker-compose.test.yml down
		
7.	An alternative is to use another command in docker-compose, **docker-compose run**.  This command causes a one-time execution of a given command on a given service:

		docker-compose run [service name] [command]
		
###Continuous Integration with Docker

1.	Once we are writing tests for our code, we can create a **continuous integration (CI)** process for our development. To do so, we will connect accounts in *GitHub*, *CircleCI*.

2.	*Continuous Integration* is a software engineering practice in which discrete changes are immediately tested and reported as they are added to the main code base branch.

3.	In a CI process, when a developer commits changes to a **version control system (VCS)** such as GitHub or BitBucket, the code goes to a Continuous Integration server, which is always listening for changes.  Upon detecting a change in the repository, it builds a new version, runs Unit Tests, and archives.  It may also push the new version to the staging or production server.

4.	The first steps in this process are to set up a *GitHub* account and *CircleCI* account.

5.	Next, got to *https://circleci.com*.  If we log in with our GitHub account, we will be connected to our GitHub repositories and can choose one for *CircleCI* to run on.

	a.	Click on the "Add Projects" button on the left side of the page, and you will see the GitHub repositories of which you are a member. If there are more than one, choose the appropriate one, then choose the project you wish for CircleCI to follow (more than one costs $).
	
	b.	Click on the "Build Project" button of the repository you want to follow. Now, whenever commits are pushed to that repository, *CircleCI* will run through its paces on that branch.

6.	In the root directory of our Git repository, we must set up a *circle.yml* file. This is where the instructions are to CircleCI to tell it what to do when a change is detected in the repository.

7.	These are some of the parts of the *yml* file:

	a.	The **machine** heading identifies the CircleCI server and services:
	
		machine:
  			pre:
    			- curl -sSL https://s3.amazonaws.com/circle-downloads/install-circleci-docker.sh | bash -s -- 1.10.0
  			services:
    			- docker
    b.	The **dependencies** section contains instruction to set up the project dependencies. In the example below, *pip* is a python dependency management tool similar to *npm*.
    
    	dependencies:
  			pre:
   				- sudo pip install docker-compose

   	c.	The **test** section contains commands for setting up tests. We use the **override** heading to include instructions that override CircleCI's default settings.
   	
   		test:
  			override:
    			- docker-compose up -d
    			- docker-compose run dockerapp python test.py

####Deployment to Docker from CircleCI

1.	So far, we have used continuous integration to test our code every time changes are pushed to the GitHub repository. The next step is to get CircleCI to take our new image and update in Docker Hub, assuming our tests are all okay.

2.	In order to connect to Docker Hub, we will need our Docker Hub account information.  We do not want to keep it insecurely in our file, so we can place it with CircleCI and then refer to it in our *circle.yml* file. To do this:

	a.	Click on the "Build" tab on the left sidebar.
	
	b.	Click on the "settings" sprocket.
	
	c.	Click on "Environment Variables."
	
	d.	Enter necessary variables.  For example, for Docker Hub, we will need our e-mail address, our Docker Hub password, and our Docker Hub UserID.  We assign each variable a name and a value.  In the *circle.yml* file, we will refer to these variables in commands by the name, preceded by a "$" symbol.
	
	e.	In the *circle.yml* file, we should add a **deployment** section, as follows:
	
		deployment:
  			hub:
    			branch: /.*/
    			commands:
      				- docker login -e $DOCKER_HUB_EMAIL -u $DOCKER_HUB_USER_ID -p $DOCKER_HUB_PWD
      				- docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
      				- docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
      				- docker push $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
      				- docker push $DOCKER_HUB_USER_ID/dockerapp:latest

	In the above code, we have the *hub* section to note we are deploying to Docker Hub. Then, the *branch* section specifies the branches that we wish to cause a deployment. For example, we may want to set up /^\d+\.\d+\.\d+$/ to only push when we have a 1.1.1 type format, but not 1.1.1-dev.  We then have a **commands** section where we tell CircleCI what to do.
	
3.	The commands are as follows:

	a.  The first command simply logs in to Docker Hub using your e-mail, userID, and password, as set in the Environment Variables of CircleCI.
	
		docker login -e $DOCKER_HUB_EMAIL -u $DOCKER_HUB_USER_ID -p $DOCKER_HUB_PWD
		
	b.	The second command tags the docker image.  First, after the tag command we specify the image name on the local box, then specify the image name on DockerHub, which will be our userID/appName:version. The version will be specified by the *CircleCI* built-in variable **CIRCLE_SHA1**, which is the GitHub hash string for the branch commit.
	
		docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
		
	c.	In addition, we tag our branch with the **latest** version tag, so that the most recent version overwrites any prior *latest* version.
	
		docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
		
	d.	Finally, we push our new versions up to Docker Hub:
	
		docker push $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
      	docker push $DOCKER_HUB_USER_ID/dockerapp:latest
      	
###Deploying Docker in Production

1.	In this section, we will run through an example of setting up a Docker containerized application in the Digital Ocean hosting service.

2.	First, note that Docker is still a new service, and there may be some reluctance to use Docker in production until it is more tried and tested. However, a number of major tech companies are already using Docker in production, and supporting tools are rapidly being developed, which should make it an easier sell in the near future.

3.	Currently, the predominant means of using Docker in production is to run Docker containers inside of Virtual Machines, to minimize security risks.  Also, without the separation, one container could use up a disproportionate amount of shared kernel resources and starve out the other containerized applications. Many popular services (such as Amazon EC2 and Google) are using VMs under the hood.

4.	**Docker Machine** is a tool to set up new VMs and run Docker containers in them. It can do the following: 

	a.	Provision new virtual machines,
	
	b.	Install the Docker engine in the VM,
	
	c.	Configure the Docker client to interact with the Docker engine,
	
	d.	Provides drivers for most of the popular cloud providers, such as AWS or Digital Ocean.  
	
5.	For hosting on a Windows or Mac machine, we can use Oracle VirtualBox to run virtual machines.

6.	One big change in hosting in the cloud from hosting on our local machine is that we cannot simply map our *app* directory, but will need to copy the app directory into our container.  Below are specific steps to take to get up and running.

####What to Do

1.	First, we need to check the branch(es) we designate in the *circle.yml* file, to make sure only the branch we want to publish is actually published.

2.	In the *docker-compose.yml* file, remove any *volumes* entry from the application service.  It will probably be along the lines of:

		volumes:
		  - ./app:/app

3.	In the *Dockerfile*, copy the app directory from localhost to the image.  Add the following command:

		COPY app /app
		
4.	After making these changes, push them to GitHub, which will trigger a build of the app.  Make sure this new image is published on Docker Hub.

5.	Set up an account with Digital Ocean. It is similar to AWS, but easier to work with.

###Setting Up on Digital Ocean

1.	After establishing a Digital Ocean account, the first step is to acquire a **Personal Access Token**.  To do so:

	a.	Click on "API" in the top menu bar.
	
	b.	Under the "Tokens" tab, click on "Generate New Token".
	
	c.	Click on "Copy to Clipboard" and save the token in a safe place for later use.
	
2.	Check to make sure **Docker-Machine** is present, by entering at the command line:

		docker-machine ls
		
	If *docker-machine* is correctly installed, then it will show a list of virtual machines.  If not, then go to Docker.com and install docker-machine.

3.	To create a docker-machine VM, use the following command:

		docker-machine create --driver digitalocean --digitalocean-access-token [personal access token]	[name of the VM]
		
4. To display the commands needed to set up the Docker client, enter the following at the command line:

		docker-machine env [name of the VM]
		
5. Run the suggested command to configure the shell ("eval $(docker-machine env [VM name]")

6.	We can then get information about the new VM by typinf at the command line:

		docker info
		
7.	Next, copy the *docker-compose.yml* file into a new root-level file, **prod.yml**.  Then change our application service *build* instruction to an *image* instruction, citing our Docker Hub image as the source of the application image.  For example, change:

		//docker-compose.yml
		version: '2'
		services:
  			dockerapp:
    			build: .
    			ports:
      				- "5000:5000"

  			redis:
    			image: redis:3.2.0

	to

		version: '2'
		services:
  			dockerapp:
    			image: cjordanball/dockerapp
    			ports:
      				- "5000:5000"

  			redis:
    			image: redis:3.2.0
    			
8.	To deploy our app, enter at the command line:

		docker-compose -f prod.yml up -d
		
9.	**Note:** There are lots of options available for our digital-ocean VM.  Google "docker digital ocean driver" to see available options.

####Dealing With Multiple Environment .yml Files

1.	We have a *docker-compose.yml* file for the development environment and a *prod.yml* file for use in production, which have a lot of common code.  We can place the common code into a single *.yml* file and use the property **extends** to bring in the common portions to each file.  For example, this might be the *common.yml* file:

		version: '2'
		services:
  			dockerapp:
    			ports:
      				- "5000:5000"

  			redis:
   	 			image: redis:3.2.0
   	 			
	In our docker-compose.yml, we can import this code as follows:
	
		version: '2'
		services:
  			dockerapp:
    			extends:
      				file: common.yml
      				service: dockerapp
    			build: .

  			redis:
    			extends:
      				file: common.yml
      				service: redis

	Obviously, in this simple example we end up with more code than we would have had without using *extends*, but in more developed situations it can prevent a lot of duplicated code.
	
