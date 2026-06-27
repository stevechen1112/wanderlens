package com.joyshot.app.util;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.batch.BatchRequest;
import com.google.api.client.googleapis.batch.json.JsonBatchCallback;
import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;
import com.joyshot.app.entity.Order;
import com.joyshot.app.service.BackupCronService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author avery
 */
@Service
public class GdriverUtil {

    private static HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE);
    private static final String USER_IDENTIFIER_KEY = "joyshotapp_prod";

    @Value("${google.oauth.callback.uri}")
    private String CALLBACK_URI;

    @Value("${google.secret.key.path}")
    private Resource gdSecretKeys;

    @Value("${google.credentials.folder.path}")
    private Resource credentialsFolder;

    @Value("${google.parent.folderId}")
    private String parentFolderId;

    @Autowired
    private BackupCronService backupCronService;

    private GoogleAuthorizationCodeFlow flow;

    @PostConstruct
    public void init() throws IOException {
        System.out.println("init :" + gdSecretKeys);
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(gdSecretKeys.getInputStream()));
        System.out.println(" gdSecretKeys:" + clientSecrets);
        flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(credentialsFolder.getFile()))
                .build();
        System.out.println(" flow:" + flow);
    }

    public boolean beenSignin() throws IOException {
        Credential credential = flow.loadCredential(USER_IDENTIFIER_KEY);
        if (credential != null) {
            boolean tokenValid = credential.refreshToken();
            if (tokenValid) {
                System.out.println("已經認證過");
                return true;
            } else {
                System.out.println("尚未認證過");
                return false;
            }
        }
        return false;
    }


    public String getRediretUrl() {
        GoogleAuthorizationCodeRequestUrl url = flow.newAuthorizationUrl();
        return url.setRedirectUri(CALLBACK_URI).setAccessType("offline").build();
    }

    public void saveToken(String code) throws IOException {
        GoogleTokenResponse response = flow.newTokenRequest(code).setRedirectUri(CALLBACK_URI).execute();
        flow.createAndStoreCredential(response, USER_IDENTIFIER_KEY);
    }

    public String createGoogleDriveSharedFoler(String orderNo) throws IOException {
        Credential credential = flow.loadCredential(USER_IDENTIFIER_KEY);
        System.out.println("createGoogleDriveSharedFoler:" + credential);

        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName("JoyShot App").build();
        File file = new File();
        file.setParents(Collections.singletonList(parentFolderId));
        file.setName(orderNo);
        file.setMimeType("application/vnd.google-apps.folder");
        String folderId = folderExists(drive, orderNo);
        if (folderId == null) {
            System.out.println("建立 " + orderNo + " 目錄");
            File createdFolder = drive.files().create(file).setFields("id").execute();
            Permission permission = new Permission();
            permission.setType("anyone");
            permission.setRole("writer");
            drive.permissions().create(createdFolder.getId(), permission).execute();

            File webViewLink = drive.files().get(createdFolder.getId()).setFields("webViewLink").execute();
            System.out.println("LINK:" + webViewLink.getWebViewLink());
            return webViewLink.getWebViewLink();
        } else {
            System.out.println(orderNo + " 目錄已存在");
            File webViewLink = drive.files().get(folderId).setFields("webViewLink").execute();
            System.out.println("LINK:" + webViewLink.getWebViewLink());
            return webViewLink.getWebViewLink();
        }
    }

    public String createGoogleDriveBackupFoler(String orderNo) throws IOException {
        Credential credential = flow.loadCredential(USER_IDENTIFIER_KEY);
        System.out.println("createGoogleDriveBackupFoler:" + credential);

        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName("JoyShot App").build();
        File file = new File();
        file.setParents(Collections.singletonList(parentFolderId));
        file.setName("JS-" + orderNo);
        file.setMimeType("application/vnd.google-apps.folder");
        String folderId = folderExists(drive, orderNo);
        if (folderId == null) {
            System.out.println("建立 JS-" + orderNo + " 目錄");
            File createdFolder = drive.files().create(file).setFields("id").execute();
            Permission permission = new Permission();
            permission.setType("anyone");
            permission.setRole("writer");
            drive.permissions().create(createdFolder.getId(), permission).execute();

            File webViewLink = drive.files().get(createdFolder.getId()).setFields("webViewLink").execute();
            System.out.println("LINK:" + webViewLink.getWebViewLink());
            return webViewLink.getWebViewLink();
        } else {
            System.out.println("JS-" + orderNo + " 目錄已存在");
            File webViewLink = drive.files().get(folderId).setFields("webViewLink").execute();
            System.out.println("LINK:" + webViewLink.getWebViewLink());
            return webViewLink.getWebViewLink();
        }
    }

    public void getFileList(String folderId) throws IOException {
        System.out.println("getFileList");

        Credential credential = flow.loadCredential(USER_IDENTIFIER_KEY);
        System.out.println("createGoogleDriveSharedFoler:" + credential);

        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName("JoyShot App").build();
        // ID of the folder


        // Retrieve the list of files in the folder
        FileList result = drive.files().list()
                .setQ("'" + folderId + "' in parents")
                .setFields("files(id, name)")
                .execute();


        // List of file IDs to copy
        List<String> fileIds = new ArrayList<>();
        List<String> fileNames = new ArrayList<>();


        List<File> files = result.getFiles();
        if (files != null && !files.isEmpty()) {
            System.out.println("Files in the folder:");
            for (File file : files) {
                fileIds.add(file.getId());//收集folder id
                fileNames.add(file.getName());//收集folder id

                System.out.println("ID: " + file.getId() + ", Name: " + file.getName());
            }
        } else {
            System.out.println("No files found in the folder.");
        }


        // Destination folder ID
        String destinationFolderId = "1IIwSemxAzfhRcINj92lPkMyXQTHZUwoa";
        BatchRequest batch = drive.batch();

        for(int i=0 ; i < fileIds.size() ; i++) {

            String fileId = fileIds.get(i);
            String fileName = fileNames.get(i);
            String copyName = "JoyShot-" + fileName;

            File copiedFile = new File();
            copiedFile.setName(copyName);
            copiedFile.setParents(Collections.singletonList(destinationFolderId));
            drive.files().copy(fileId, copiedFile)
                    .queue(batch, new JsonBatchCallback<File>() {
                        @Override
                        public void onSuccess(File file, HttpHeaders httpHeaders) throws IOException {
                            System.out.println("Copy created with ID: " + file.getId());
                        }

                        @Override
                        public void onFailure(GoogleJsonError googleJsonError, HttpHeaders httpHeaders) throws IOException {
                            System.out.println("Error copying file: " + googleJsonError.getMessage());
                        }
                    });
        }

        batch.execute();


    }

    public void doBackup(String orderNo, String folderId, String destinationFolderId) throws IOException {
        System.out.println("doBackup　from:" + folderId + " to:" + destinationFolderId);

        Credential credential = flow.loadCredential(USER_IDENTIFIER_KEY);
        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName("JoyShot App").build();
        // Retrieve the list of files in the folder
        FileList result = drive.files().list()
                .setQ("'" + folderId + "' in parents")
                .setFields("files(id, name)")
                .execute();

        // List of file IDs to copy
        List<String> fileIds = new ArrayList<>();
        List<String> fileNames = new ArrayList<>();

        List<File> files = result.getFiles();
        if (files != null && !files.isEmpty()) {
            for (File file : files) {
                fileIds.add(file.getId());//收集folder id
                fileNames.add(file.getName());//收集folder id
                System.out.println("ID: " + file.getId() + ", Name: " + file.getName());
            }
        } else {
            System.out.println("No files found in the folder.");
        }

        List<File> copiedFiles = new ArrayList<>();

        // Destination folder ID
        BatchRequest batch = drive.batch();
        for(int i=0 ; i < fileIds.size() ; i++) {
            String fileId = fileIds.get(i);
            String fileName = fileNames.get(i);
            String copyName = "Copy-" + fileName;

            File copiedFile = new File();
            copiedFile.setName(copyName);
            copiedFile.setParents(Collections.singletonList(destinationFolderId));
            drive.files().copy(fileId, copiedFile)
                    .queue(batch, new JsonBatchCallback<File>() {
                        @Override
                        public void onSuccess(File file, HttpHeaders httpHeaders) throws IOException {
                            copiedFiles.add(file);
                            System.out.println("Copy created with ID: " + file.getId() + " " + copiedFiles.size() + "/" + fileIds.size());
                            if (copiedFiles.size() == fileIds.size()) {
                                // All files finished copying
                                System.out.println("All files finished copying.");
                                backupCronService.finishBackup(orderNo);
                            }
                        }

                        @Override
                        public void onFailure(GoogleJsonError googleJsonError, HttpHeaders httpHeaders) throws IOException {
                            System.out.println("Error copying file: " + googleJsonError.getMessage());
                        }
                    });
        }

        batch.execute();
    }

    public String createGoogleDriveSharedFoler(Order order) throws IOException {
        return createGoogleDriveSharedFoler(order.getOrderNo());
    }

    private String folderExists(Drive drive, String folderName) throws IOException {
        File fileMetadata = new File();
        fileMetadata.setMimeType("application/vnd.google-apps.folder");
        fileMetadata.setName(folderName);
        String pageToken = null;
        String folderId = null;
        do {
            String query = " mimeType = 'application/vnd.google-apps.folder' ";
            query = query + " and '" + parentFolderId + "' in parents";
            FileList result = drive.files().list().setQ(query)
                    .setSpaces("drive")
                    .setFields("nextPageToken, files(id, name)")
                    .setPageToken(pageToken)
                    .execute();
            for (File file : result.getFiles()) {
                if (file.getName().equalsIgnoreCase(folderName)) {
                    folderId = file.getId();
                    break;
                }
            }
            pageToken = result.getNextPageToken();
        } while (pageToken != null && folderId == null);
        return folderId;
    }
}
