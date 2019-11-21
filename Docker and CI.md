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
    docker start [container id] && docker attach [container id]
    ```

#### exit
1. To exit the interactive container, type the following at the command line:
    ```
    exit
    ```
    Once a container has run and exited, it remains in the list of containers, until removed.

#### kill
1. To kill one or more running containers (for example, one running in background that we can't get to), type the following at the command line:
    ```
    docker kill [container ids]
    ```
    
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

#### exec
1. The **exec** command allows us to run commands inside a running container. For example, the following allows us to run the *bash* command in our container:
    ```
    docker exec -it [container id /bin/bash 
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
#### deleting an image
1. To delete a local docker image, run the following command from the terminal:
  ```
  docker image rm [image]
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

## Detail Dockerfile
1. **Chaining Run Instructions:** As noted above, for each RUN instruction in the Dockerfile, the *build* command will create a new Docker temporary container and image. It is more efficient to have a single RUN command chaining together multiple steps. For the above example, we can chain the *apt-get update* and *apt-get install* commands, and then chain the items to install, as follows:
    ```
    FROM debian:jessie
    RUN apt-get update && apt-get install -y git vim
    ```

2. **Put Multi-Line Arguments in Alphabetical Order:** This will make it easier to avoid unnecessary duplication. To make multi-line arguments, use the "\" to escape the newline command:
    ```
    FROM debian:jessie
    RUN apt-get update && apt-get install -y \
        git \
        python \
        vim
    ```

3. **CMD Instruction:** This is another common instruction in the Dockerfile, and it tells Docker what command should be run when the container starts up (**not** when the image is built). If no CMD instruction is given, Docker will use the default command defined in the base image.  Note, however, that this is merely a default, and a different command can be set when the container is created, using the *run* command.

    The CMD instruction should be in *shell form*, or in *exec formU*, with an array containing the command, followed by any arguments.  For example:
    ```
    CMD ["echo", "hello world"]
    
    //could be: CMD echo "hello world"
    ```
4. Another reason to chain the *apt-get update* instruction with *apt-get install* instruction has to do with the **Docker cache.**  If a build step has been performed previously, the next time *build* is called, Docker will used the cached version of images when the commands are the same. This is faster, but can result in an image getting out-of-date. For example, if an image is made today, and the debian operating system is updated tomorrow, then our image will get out-of-date if new builds keep using the cached OS.

5. An alternative is to turn off the use of cache, as follows:
    ```
    docker build -t cjordanball/debian . --no-cache=true
    ```
    **Note:**: Even the *RUN apt-get update* uses a cached imaage if it is the command hasn't been chaged and caching is in effect.

6. 


### Summary of Dockerfile Instructions

#### FROM
1. The first instruction in a Dockerfile, it tells us where to start; typically with the setting of an operating system.

#### RUN
1. The basic command telling Dockerfile to execute whatever code follows it.

#### CMD
1. Tells Docker what command should be run when the container starts up; otherwise, the default command will run. Note, however, that the user could provide a different command in starting the container.

#### EXPOSE
1. Tells Docker which port we want our app to expose to the outside. We can map this onto a different port in our *run* command later, if we wish.

#### COPY
1. In addition to installing operating systems and utilities to our image, we also will want to copy in files or directories of text, code, images, *etc*. Of course, we need to provide instruction of what files to copy, and where they are located.
    ```
    COPY testText.txt /scr/testText.txt
    ```
    The command above will find the testText.txt file in the **build context directory** and place it in the designated location. **It will build the directory structure if not present.** 

#### ADD
1. ADD is a more general case of the COPY instruction. It can do other things; for example, it can download a file from a remote location and add it to the image or automatically unpack compressed files. **COPY** is preferred, unless **ADD** is necessary.


#### WORKDIR
1. The **WORKDIR** instruction sets the working directory for any RUN, COPY, CMD, ENTRYPOINT, and ADD instructions that follow it. It can be used multiple times, and if a relative path is provided, then it will be relative to the path of the previous WORKDIR path.

2. If the directory does not yet exist, it will be created, **even if it is not used thereafter.**

## Using Docker Hub
1. We can store images on Docker Hub, which operates in a manner similar to Github.


2. To update the name of an image, we can use the **tag** command, as follows:
    ```
    docker tag [image ID] [new name:tag]
    ```
		
3. To push an image to Docker Hub, do the following:

    a. Make sure the image has a name in the form of:
    ```
    acctUsername/imageName
    ```
    for example:
    ```
    cjordanball/node-web-app
    ```
    b. Next, we should type from the command line:
    ```
    docker login --username=cjordanball
    ```
    where I am using my username. Then I enter my password.  After that, to send an image to Docker Hub, I can use the command:
    ```
    docker push [image name]/[tag]
    ```

## Example: Dockerize a Simple Node App

### Create a Simple Node App
1. First, we will create a basic "Goodbye, Cruel World" application using Express, with the following *package.json* file:
    ```json
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
    ```

2. Next, we create an *index.js* file, which uses Express to handle two routes:
    ```javascript
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
    ```

### Create the Dockerfile
1. Next, we create a **Dockerfile** for the project, to tell Docker how to assemble our image:

    a. We first designate the version of Node we want to run:
    ```
    FROM node:7
    ```
    b. Next, we can create a directory to hold the app and designate it as the working directory (no need to actuall use *mkdir*, *WORKDIR* will create the necessary pathway:
    ```
    WORKDIR /usr/src/app
    ```
    c. Next, copy the *package.json* file into the working directory and then run *npm install*
    ```
    COPY package.json /usr/src/app/
    RUN npm install
    ```
    **Note:** It is a great idea to COPY the *package.json* file and then RUN npm install on it *before* copying the rest of the application folder. That way, the cache can be used on rebuilds for the node modules.
    
    e. Next, we can add an *admin* user and specify it as the user, so that we can be sure we are not running the app server as the **root** user.
    ```
    RUN useradd -ms /bin/bash admin
    USER admin
    ```
		
    d. Next, send our source code ot the Docker image using COPY:
    ```
    COPY . /usr/src/app
    ```

    e. Next, use the EXPOSE instruction to have our port mapped:
    ```
    EXPOSE 3142
    ```
    
    f. Finally, define the start-up command to run:
    ```
    CMD ["npm", "start"]
    ```

4. Create a **.dockerignore** file to tell docker what not to copy:
    ```
    node_modules
    npm-debug.log
    ```

5. At this point, we can create our image:
    ```
    docker build -t cjordanball/node_app .
    ```

6. To run the image, we must map the port to the one exposed by Docker (even if it is the same):
    ```
    docker run -p 8000:3142 -d cjordanball/node_app
    ```
    
7. We can see the output of the application by running the *docker logs* command:
    ```
    docker logs [container ID]    
    ```

		
8. Also, when we create the container with Node from the Docker Hub, we are actually getting Node running in a Linux OS.  We can go into the file system with the following command:
    ```
    docker exec -it cjordanball/node_app /bin/bash
    ```
    
## Linking Containers    

### Introduction - Manual Linking

1. The main use for docker container linking is in building an application with a microservice architecture, so that we are able to run many independent components in different containers.

1. Docker containers can be linked, so that they can communicate with each other internally, without exposing a port. For example, we can have a web server in one container serving a single-page web app, and a NodeJS server in another container for our API, and then link them so that they can communicate.

2. In our example, let's have a simple web-app in one container, which we can refer to as the *recipient*.  In another container, we will place Redis, an in memory data-storage service; we will refer to this container as the *source*.

3. As a first step, we will use the *run* command to create our redis container, giving it the name *redis*. The **naming is necessary** so that we have a reference to the container when we make our link.
    ```
    docker run -d --name redis redis:3.2.0 
    ```
 
5. Once we have the *redis* container running, and we have created an image of our recipient python app, we run the following command:
    ```
    docker run -d -p 5000:5000 --link redis dockerapp:v0.3
    ```
    **Note**: The **--link redis** instruction links the container labelled *redis* to the new recipient container. ""dockerapp:v0.3" is the name of the image on which we are creating our container.

6. When we use the link command, docker adds entries to the **/etc/hosts** file in the *recipient* file, assining an IP address to the source container name. We can see the same information by running *docker inspect* on the source container.

### Using Docker Compose
1. The above approach of manually linking containers would quickly become unwieldy as the number of containers involved grows. In order to keep track of everything, and simplify our startup process, we can use a tool called **Docker Compose**. This allows us to run a single command to create and start all the services in our configuration.

2. As a first step, make sure **docker-compose** is installed by running at the command line:
    ```
    docker-compose version
    ```
    If not, go to the Docker page and follow the directions to download and install it.

3. To use Docker Compose, we define all our services in a file entitled **docker-compose.yml**. Once that is done, we can astart everything with the single command:
    ```
    docker-compose up
    ```
4. When using Docker-Compose, linking is not required, because each service can communicate with each other service by name. As an example docker-compose.yml file:
    ```yaml
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
    ```
    **version**: The version should be '2.' This is the more up-to-date version, and allows us to forgo linking.
    
    **services**: Each service should get an entry, which will contain instructions how to build and run the container for that service.
    
    **build**: The build property tells docker where to find the files for building the service container. Since the *docker-compose.yaml* file is kept in the root directory, we designate its value as ".".
    
    **ports**: This property allows us to list any ports of the container to expose to the external network. As we have seen before, the first value is the one that the network will have mapped to the second port number, which is the true port of the service (host port: container port).
    
    **volumes**: A volume is a designated directory in a container which is designated to persist data, independent of the container's life cycle. A typical use of *volumes* is to share data between the container and the host machine. The volume is defined in the format **host directory:container directory**. So, we should remove the *copy* instruction from the Dockerfile.  **This allows us to make changes in the host machine and see the results immediately, without having to rebuild the image.**

    **image**: Every service will need either an *image* or a *build* instruction. In our case, we have already build the image, so we can just refer to it.

    **No Linking**: Docker Compose allows each listed service to communicate directly with every other list service, so we do not need to do any more linking!
    
5. When we run the **docker-compose up** command, we can attach the *-d* command to run it in the background.		 

6. To see the status of the containers being managed by docker-compose, we should run the following at the command line (we must be in the correct directory):
    ```
    docker-compose ps
    ```
7. We can also see information by the command:
    ```
    docker-compose logs
    ```
    **NOTE:** Append the container name to the above command to see the output for a specific container.
	
    **NOTE:** The above command just shows the logs through the present. To keep it open, use the **-f** flag to have the log output stay active. To turn it off, hit CTRL-C.

8. To stop all the running containers, without removing them:
    ```
    docker-compose stop
    ```
		
9. We can restart these containers again with either:
    ```
    docker-compose start
    docker-compose up
    ```

10. To get rid of all containers in the docker-compose file:
    ```
    docker-compose rm
    ```

11. If we make a modification to our code (such as in the Dockerfile), we cannot use *docker-compose up* to rebuild the container with the changes, because Docker will see the image already exists. To force a rebuild, use the command:
    ```
    docker-compose build
    ```

## Docker Networking

### Introduction
1. There are four types of Docker Networks:

    a. Closed (None) Network
    
    
    b. Bridge Network
    
    c. Host Network
    
    d. Overlay Network

2. To see what Docker networks exist on our machine, type in the following at the command line:
    ```
    docker network ls
    ```
    This should list at least three networks, which are installed with Docker initially, one each for **bridge**, **host**, and **none**.

### None Network
1. This network has no access to the outside world.



## Testing with Docker

### Introduction
1. Docker containers make a great environment for testing, as they can be spun up very quickly and run as an isolated environment.

### Example (From Lectures)
1. The example in this section is based on the lectures, and the code can be found in the *lookup* app in the *apps* directory of this github repository. Don't worry too much about the actual code, it is in python; just get the general idea as to how the tests are set up.

2. In the example app, we have a tests file, **test.py**, contained in the app directory of our app. It has a setUp and then has two tests, one for saving values to the key store, and the other for checking the values.

3. To begin, we will start up the app with the command:
    ```
    docker-compose up -d
    ```
    Remember, this will start up two containers for us, the redis container, and the dockerapp container.
    
4. Next, we will use a new Docker Compose command, **docker-compose run**. This will take the name of the service and run a command **one time** against that service.
    ```
    docker-compose run dockerapp python test.py
    ```
    Note that **Dockerfile** contains a default command (in this case, "python app.py"), but the **run** command will override that.
    
5. Note that in this case, we are placing all our tests into our main Docker image. This can increase reliability; however, it also increases the size of our image.

### Example (Node / Mocha or Jasmine)

## Continuous Integration (CI) with Docker

### Introduction
1. Once we are writing tests for our code, we can create a **continuous integration (CI)** process for our development. To do so, we will connect accounts in *GitHub*, *CircleCI*.

2. *Continuous Integration* is a software engineering practice in which discrete changes are immediately tested and reported as they are added to the main code base branch. The goal is to provide rapid feedback, so bugs can be identified and corrected as quickly as possible.

3. In a CI process, when a developer commits changes to a **version control system (VCS)** such as GitHub or BitBucket, the code goes to a Continuous Integration server, which is always listening for changes.  Upon detecting a change in the repository, it builds a new version, runs unit tests, and archives.  It may also push the new version to the staging or production server.

4. We will create a CI pipeline using Github and the CircleCI continuous integration server.

### Setting Up
1. First, we must set up a *GitHub* account and *CircleCI* account.

2. Next, go to *https://circleci.com*.  If we log in with our GitHub account, we will be connected to our GitHub repositories and can choose one for *CircleCI* to run on.

    a. Click on the "Add Projects" button on the left side of the page, and you will see the GitHub repositories of which you are a member. If there are more than one, choose the appropriate one, then choose the project you wish for CircleCI to follow (more than one costs $).
	
    b. Click on the "Build Project" button of the repository you want to follow. Now, whenever commits are pushed to that repository, *CircleCI* will run through its paces on that branch.

3. In the root directory of our Git repository, we must set up a *circle.yml* file. This is where the instructions are to CircleCI telling it what to do when a change is detected in the repository.

7. These are some of the parts of the *yml* file:

    a. The **machine** heading identifies the CircleCI server and services:
    ```
    machine:
      pre:
      - curl -ssl https://s3.amazonaws.com/circle-downloads/install-circleci-docker.sh | bash -s -- 1.10.0
      services:
        - docker
    ```
    b.	The **dependencies** section contains instruction to set up the project dependencies. In the example below, *pip* is a python dependency management tool similar to *npm*.
    ```
    dependencies:
      pre:
        - sudo pip install docker-compose
    ```
    c. The **test** section contains commands for setting up tests. We use the **override** heading to include instructions that override CircleCI's default settings.
    ```
    test:
      override:
        - docker-compose up -d
        - docker-compose run dockerapp python test.py
    ```

### Deployment to Docker from CircleCI
1. So far, we have used continuous integration to test our code every time changes are pushed to the GitHub repository. The next step is to get CircleCI to take our new image and update in Docker Hub, assuming our tests are all okay.

2. In order to connect to Docker Hub, we will need our Docker Hub account information.  We do not want to keep it insecurely in our file, so we can place it with CircleCI and then refer to it by variale name in our *circle.yml* file. To do this:

    a. Click on the "Build" tab on the lef sidebar.

    b. Click on the "settings" sprocket.
    
    c.	Click on "Environment Variables."
	
    d. Enter the necessary variables. For example, for Docker Hub, we will need our e-mail address, our Docker Hub password, and our Docker Hub UserID.  We assign each variable a name and a value.  In the *circle.yml* file, we will refer to these variables in commands by the name, preceded by a "$" symbol.
    
    e. In the *circle.yml* file, we should add a **deployment** section, along the lines of:
    ```yaml
    deployment:
      hub:
        branch: /.*/
        commands:
          - docker login -e $DOCKER_HUB_EMAIL -u $DOCKER_HUB_USER_ID -p $DOCKER_HUB_PWD
          - docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
          - docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
          - docker push $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
          - docker push $DOCKER_HUB_USER_ID/dockerapp:latest
    ```
    **hub**: In the above code, the *hub* section indicates that we are deploying to Docker Hub.
    
    **branch**: The *branch* section specifies the branches that we wish to cause a deployment. For example, we may want to set up /^\d+\.\d+\.\d+$/ to only push when we have a 1.1.1 type format, but not 1.1.1-dev.
    
    **commands**: This section tells CircleCI what we wish for it to do. They are discussed below.
    
3. The **commands** are as follows:

    a. The first command simply logs in to Docker Hub using your e-mail, userID, and password, as set in the Environment Variables of CircleCI.
    ```
    docker login -e $DOCKER_HUB_EMAIL -u $DOCKER_HUB_USER_ID -p $DOCKER_HUB_PWD
    ```

    b. The second command tags the docker image. First, after the tag command we specify the image name on the local box, then specify the image name on DockerHub, which will be our userID/appName:version. The version will be specified by the *CircleCI* built-in variable **CIRCLE\_SHA1**, which is the GitHub hash string for the branch commit.
    ```
    docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
    ```

    c. In addition, we tag our branch with the **latest** version tag, so that the most recent version overwrites any prior *latest* version.
    ```
    docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
    ```

    d. Finally, we push our new versions up to Docker Hub:
    ```
    docker push $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
    docker push $DOCKER_HUB_USER_ID/dockerapp:latest

## Deploying Docker in Production

### Introduction
1. In this section, we will run through an example of setting up a Docker containerized application in the Digital Ocean hosting service.

2. First, note that Docker is still a new service, and there may be some reluctance to use Docker in production until it is more tried and tested. However, a number of major tech companies are already using Docker in production, and supporting tools are rapidly being developed, which should make it an easier sell in the near future.

3. Currently, the predominant means of using Docker in production is to run Docker containers inside of Virtual Machines, to minimize security risks.  Also, without the separation, one container could use up a disproportionate amount of shared kernel resources and starve out the other containerized applications. Many popular services (such as Amazon EC2 and Google) are using VMs under the hood.

4. **Docker Machine** is a tool to set up new VMs and run Docker containers in them. It can do the following: 

    a. Provision new virtual machines,
	
    b. Install the Docker engine in the VM,
	
    c. Configure the Docker client to interact with the Docker engine,
	
    d. Provides drivers for most of the popular cloud providers, such as AWS or Digital Ocean.

5. For hosting on a Windows or Mac machine, we can use Oracle VirtualBox to run virtual machines.

6. One big change in hosting in the cloud from hosting on our local machine is that we cannot simply map our *app* directory, but will need to copy the app directory into our container.  Below are specific steps to take to get up and running.

### What to Do
1. First, we need to check the branch(es) we designate in the *circle.yml* file, to make sure only the branch we want to publish is actually published.

2. In the *docker-compose.yml* file, remove any *volumes* entry from the application service. It will probably be along the lines of:
    ```
    volumes:
      - ./app:/app
    ```


3. In the *Dockerfile*, copy the app directory from localhost to the image.  Add the following command:
    ```
    COPY app /app
    ```

4. After making these changes, push them to GitHub, which will trigger a build of the app. Make sure this new image is published on Docker Hub.


5. Set up an account with Digital Ocean. It is similar to AWS, but easier to work with.

### Setting Up on Digital Ocean
1. After establishing a Digital Ocean account, the first step is to acquire a **Personal Access Token**.  To do so:

    a. Click on "API" in the top menu bar.
	
    b. Under the "Tokens" tab, click on "Generate New Token".
	
    c. Click on "Copy to Clipboard" and save the token in a safe place for later use.

2. Check to make sure **Docker-Machine** is present, by entering at the command line:
    ```
    docker-machine ls
    ```
    If *docker-machine* is correctly installed, then it will show a list of virtual machines.  If not, then go to Docker.com and install docker-machine. 

3. To create a docker-machine VM, use the **docker-machine create** command, as follows (the "name of VM" means the name we wish to give it"):
    ```
    docker-machine create --driver digitalocean 
      --digitalocean-access-token [personal access token]
      [name of the VM]
    ```
    This can take a few minutes, for Docker to provision the Virtual Machine.
    
    Also, note that we can also create a docker-machine for AWS, or Azure, or other services.

4. To display the commands needed to set up the Docker client, enter the following at the command line:
    ```
    docker-machine env [name of the VM]
    ```
    **Note**: at this point, we have established a virtual machine in which Docker is running, but we have done nothing to connect it to our Docker client, where our app resides.

5. Run the suggested command to configure the shell to connect it to our Docker client:
    ```
    eval $(docker-machine env [VM name]
    ```

6. We can then get information about the new VM by typing at the command line:
    ```
    docker info
    ```
		
7. Next, copy the *docker-compose.yml* file into a new root-level file, **prod.yml**.  Then change our application service *build* instruction to an *image* instruction, citing our Docker Hub image as the source of the application image.  For example, change:
    ```yaml
    # docker-compose.yml
    version: '2'
      services:
        dockerapp:
          build: .
          ports:
            - "5000:5000"

        redis:
          image: redis:3.2.0
    ```

    to

    ```yaml
    version: '2'
    services:
      dockerapp:
        image: cjordanball/dockerapp
        ports:
          - "5000:5000"

      redis:
        image: redis:3.2.0
    ```

8. **FINALLY**: To deploy our app, enter at the command line:
    ```
    docker-compose -f prod.yml up -d  
    ```
    This is our *docker-compose* starting command, and is referring to the **prod.yml** file for instructions as to the services. As usual, the **-d** flag causes the containers to run in the background.
    
    **-f**: The default file to tell docker-compose what to do is the *docker-compose.yml* file. With the -f flag, we can designate another file, such as the prod.yml file.

9. Now, if we run the *docker-machine ls* command, we will see our new virtual machine listed, with a Driver of "digitalocean" and an URL:port. At this point the site should be up and running in the cloud, and we should be able to access it at the listed URL, but at the port we have assigned it.

10. Note that there are lots of options available for our digital-ocean VM. Google "docker digital ocean driver" to see available options.

### Dealing With Multiple Environment .yml Files
1. At this point, we have a *docker-compose.yml* file for the development environment and a *prod.yml* file for use in production, which have a lot of common code.  We can place the common code into a single *.yml* file and use the **extends** property to bring in the common portions to each file. For example, this might be the *common.yml* file:
    ```yaml
    # common.yaml
    version: '2'
    services:
      dockerapp:
        ports:
          - "5000:5000"

      redis:
        image: redis:3.2.0
    ```

2. In our *docker-compose.yml*, we can import this code as follows:
    ```yaml
    # docker-compone.yaml
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
    ```
3. And in our production file, we will have:
    ```yaml
    # prod.yaml
    version: '2'
    services:
      dockerapp:
        extends:
          file: common.yml
          service: dockerapp
        image: jleetutorial/dockerapp

      redis:
        extends:
          file: common.yml
          service: redis
    ```

    Obviously, in this simple example we end up with more code than we would have had without using *extends*, but in more developed situations it can prevent a lot of duplicated code.

## Docker Swarm

### Introduction
1. This section deals with scaling Docker for large applications, where we could have hundreds of containers, on multiple hosts. **Docker Swarm** is a tool that clusters many Docker Engines and schedules containers. It decides which host on which to run a container, based on our scheduling methods.

2. As illustrated in the accompanying drawing, a Docker Daemon runs on every remote host in the cloud. Each one communicates with the **Docker Swarm manager**. The Swarm Manager keeps track of the status of all the nodes in our cluster. The **Docker Client**, instead of dealing with the nodes, communicates only with the Swarm Manager.

3. Docker Swarm sends containers to the nodes, dividing up the work among them.

4. We can also point multiple clients to the same Swarm Manager, so multiple users can share a swarm cluster.

### Setting Up the Swarm
1. First, we need to set up environment variables from the command line:
    ```
    export DIGITALOCEAN_ACCESS_TOKEN=[our token]
    export DIGITALOCEAN_PRIVATE_NETWORKING=true
    export DIGITALOCEAN_IMAGE=debian-8-x64
    ```
2. **Service Discovery** is a key component of most distributed systems and service oriented architectures. For Docker Swarm, this means keeping track of the state of each node in the cluster. This is done with a **key/value store**, where each node is registered, so the Swarm Manager can see the state of each node through the store.

3. The **key/value store** is maintained in a service, such as *Consul* or *Apache Zookeeper*. Here, we will follow along with Consul.

4. Deploying the Docker app on the Swarm cluster will involve the following:

    a. Provision a Consul machine and run the Consul server on it as a key/value store for discovering services,
    
    b. Provision a Docker Swarm master node,
    
    c. Provision a Docker Swarm slave node,
    
    d. Define the overlay network to support multi-host networking,
    
    e. Deploying our Docker app services on the Swarm cluster with **Docker Compose**.
    
#### Step One - Create Consul Machine
1. Run the following command to set up a digital ocean docker machine for Consul:
    ```
    docker-machine create -d digitalocean consul
    ```
    **Note**: This will be used by the Swarm, but will not be part of the Swarm itself.

2. We can access the machine using ssh by:
    ```
    docker-machine ssh [name of machine]
    ```

3. We can view the networking details of the docker-machine using the **ifconfig** command, which is used to configure, or view the configuration of, a network interface. We should see four entries:

    a. **docker0** - the usual bridge network,
    
    b. **eth0** - allows inbound and outbound access to the entire internet,
    
    c. **eth1** - allows private networking among hosts in the same data center,
    
    d. **local** - the loopback

    We will use the eth1 network, so we share the info in Consul only with our private network. We should go ahead and set an env variable with the private IP address:
    ```
    export KV_IP=[the address]
    ```
4. Then, we connect our docker client to this new host:
    ```
    eval $(docker-machine env consul)
    ```
5. Next, to start up the key/value store service, we can run a command as follows:
    ```
    docker run -d -p ${KV_IP}:8500:8500 --restart always 
        gliderlabs/consul-server -bootstrap
    ```
    **-p**: we can provide it an optional parameter of an IP addreess as an initial value, which we are doing through the variable we named
    
    **restart**: a command to tell when the server should automatically restart if it goes down, we tell it to always restart
    
    **gliderlabs/consul-server** is a key/value service we are going to use from DockerHub
    
    **--bootstrap**: a command for the *gliderlabs/consul-server*. 

#### Step 2 - Provision a Master Node
1. Note first that we will need our environment variables from before, so check to see if they are still available with *echo*.

2. The **master node** is what we also refer to as the **swarm manager**. We need to set it up as the master node.

3. The command for setting up the master node vm:
    ```
    docker-machine create -d digitalocean --swarm --swarm-master 
    --swarm-discovery="consul://${KV_IP}:8500" --engine-opt=
    "cluster-store=consul://${KV_IP}:8500" --engine-opt=
    "cluster-advertise=eth1:2376" master
    ```
    **--swarm**: lets docker-machine know that this is a part of a swarm (which will consist of a **master** and an arbitrary number of ordinary nodes.
    
    **--swarm-master**: alerts the fact that this is the master node, or swarm manager.
    
    **--swarm-discovery**: assigned a value that tells the IP and port to access the key-value store.
    
    **engine-opt** allows us to set option flags. The two present here are: i) **--cluster-store**, which key/value store to use for cluster coordination, and **--cluster-advertise", which provides an address that the Docker daemon should advertise as connectible to the cluster 

    **master**: the name of the master node
   
#### Step 3 - Provision One or More Slave Nodes
1. The commands are very similar to those used to create the master node:
    ```
    docker-machine create -d digitalocean --swarm 
    --swarm-discovery="consul://${KV_IP}:8500" --engine-opt=
    "cluster-store=consul://${KV_IP}:8500" --engine-opt=
    "cluster-advertise=eth1:2376" slave01
    ```
    Just remove the --swarm-master flag, and chenge the name of the node.
    
2. Note that the master node is also a slave node, it occupies both roles.  It can run containers itself, as well as manage the other nodes.

#### Step 4 - Support Multi-Host Networking
1. This step is handled by modifying our *docker-compose* yaml file.

2. First, we need to make sure that our services are started in the correct order. This is done by adding a "depends_on" property to services that have dependencies. In the following example, the "dockerapp" service depends on redis, so redis should be opened first:
    ```yaml
    version: '2'
    services:
      dockerapp:
        extends:
          file: common.yml
          service: dockerapp
        image: jleetutorial/dockerapp
        depends_on:
          - redis

      redis:
        extends:
          file: common.yml
          service: redis
    ```
3. Then, in the yaml file, we must add a "networks" property to each service, so that we can add the **overlay network**. In the example below, this will be the "myNet".
    ```yaml
    version: '2'
    services:
      dockerapp:
        extends:
          file: common.yml
          service: dockerapp
        image: jleetutorial/dockerapp
        environment:
          - constraint:node=master
        depends_on:
          - redis
        networks:
          - myNet

      redis:
        extends:
          file: common.yml
          service: redis
        network:
          - myNet
    networks:
      myNet:
        driver: overlay   
    ```
    **Note**: We have also added a "networks" property to the root of the yaml file. We added the **myNet** network, and defined it as an **overlay** network, which can allow containers in different hosts to communicate.

#### Deploy with Docker Compose
1. At this point, all we need to do is go to the directory of our app and run:
    ```
    docker-compose -f prod.yml up -d
    ```
2. The swarm manager has a default to spread the services among the available nodes. We can set the node to be used for a service, however, within the *docker-compose.yml* file, as follows:
    ```
    version: '2'
    services:
      dockerapp:
        extends:
          file: common.yml
          service: dockerapp
        image: jleetutorial/dockerapp
        depends_on:
          - redis
        networks:
          - myNet


    ```


::: danger
Rest here
::::


###Testing		


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
