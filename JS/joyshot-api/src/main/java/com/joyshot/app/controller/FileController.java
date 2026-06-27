package com.joyshot.app.controller;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.entity.FileRepo;
import com.joyshot.app.mapper.FileRepoMapper;
import com.joyshot.app.service.FileRepoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/file")
public class FileController {

    @Value("${file.upload-location}")
    private String SERVER_UPLOAD_PATH;

    @Autowired
    private FileRepoMapper fileRepoMapper;

    @Autowired
    private FileRepoService fileRepoService;

    @PostMapping("/upload/{usage}")
    public FileRepo upload(@RequestParam MultipartFile file, HttpServletRequest request, @PathVariable String usage) throws IOException {
        System.out.println("usage:" + usage);
        FileRepo result = fileRepoService.handleUpload(usage, file);
        return result;
    }

    @PostMapping("/upload-works/{phId}")
    public FileRepo uploadWorks(@RequestParam MultipartFile file, @PathVariable Integer phId) throws IOException {
        FileRepo result = fileRepoService.handleWorksUpload(phId, file);
        return result;
    }

    @GetMapping("/show/{fileUUID}")
    public void showImage(@PathVariable String fileUUID, HttpServletResponse response) throws IOException {
        //find path
        QueryWrapper<FileRepo> query = new QueryWrapper<>();
        query.eq("uuid", fileUUID);
        FileRepo one = fileRepoMapper.selectOne(query);

        //get file
        if(one != null) {
            try {
                ServletOutputStream outputStream = response.getOutputStream();
                response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(one.getName(), "UTF-8"));
                response.setContentType("application/octet-stream");

                byte[] array = Files.readAllBytes(Paths.get(SERVER_UPLOAD_PATH + one.getUrl()));

                outputStream.write(array);
                outputStream.flush();
                outputStream.close();
            } catch(Exception e) {
                System.out.println("one:" + e);
                throw new ServiceException(Status.CODE_ERROR, "輸出檔案錯誤");
            }

        } else {
            throw new ServiceException(Status.CODE_ERROR, "查無檔案:"+fileUUID);
        }
    }

    @GetMapping("/{fileUUID}")
    public void download(@PathVariable String fileUUID, HttpServletResponse response) throws IOException {
        //find path
        QueryWrapper<FileRepo> query = new QueryWrapper<>();
        query.eq("uuid", fileUUID);
        FileRepo one = fileRepoMapper.selectOne(query);

        //get file
        if(one != null) {
            try {
                ServletOutputStream outputStream = response.getOutputStream();
                response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(one.getName(), "UTF-8"));
                response.setContentType("application/octet-stream");
                outputStream.write(one.getFileObj());
                outputStream.flush();
                outputStream.close();
            } catch(Exception e) {
                System.out.println("one:" + e);
                throw new ServiceException(Status.CODE_ERROR, "輸出檔案錯誤");
            }

        } else {
            throw new ServiceException(Status.CODE_ERROR, "查無檔案:"+fileUUID);
        }
    }

    @GetMapping("/list/{fileUUID}")
    public Result fileList(@PathVariable String fileUUID) throws IOException {
        QueryWrapper<FileRepo> query = new QueryWrapper<>();
        query.eq("uuid", fileUUID);
        List<FileRepo> one = fileRepoMapper.selectList(query);
        return Result.success(one);
    }

}
